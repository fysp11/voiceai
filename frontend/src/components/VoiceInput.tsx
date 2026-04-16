import { useEffect, useRef, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useVoiceAIStore } from '@/store/voiceAI'

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoiceInput() {
  const { isRecording, setRecording, addMessage, settings, isSpeaking, setSpeaking } = useVoiceAIStore()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [transcript, setTranscript] = useState('')

  const processAudio = useCallback(async (text: string) => {
    if (!text.trim() || !settings.openaiApiKey) return

    addMessage({ role: 'user', content: text })

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: 'You are a helpful voice assistant. Keep responses concise and natural.' },
            { role: 'user', content: text },
          ],
          max_tokens: 200,
        }),
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.'

      addMessage({ role: 'assistant', content: reply })

      if (settings.elevenlabsApiKey && reply) {
        setSpeaking(true)
        await speakWithElevenLabs(reply)
        setSpeaking(false)
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      addMessage({ role: 'assistant', content: 'Sorry, an error occurred while processing your request.' })
    }
  }, [settings, addMessage, setSpeaking])

  const speakWithElevenLabs = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': settings.elevenlabsApiKey,
          },
          body: JSON.stringify({
            text,
            model: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      )

      if (!response.ok) throw new Error('TTS failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      await audio.play()
    } catch (error) {
      console.error('TTS Error:', error)
    }
  }

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setRecording(true)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          setTranscript(result[0].transcript)
        }
      }
      if (finalTranscript) {
        processAudio(finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setRecording(false)
    }

    recognition.onend = () => {
      setRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [setRecording, processAudio])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setRecording(false)
    }
  }, [setRecording])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        size="lg"
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full transition-all ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        disabled={isSpeaking}
      >
        {isRecording ? (
          <span className="text-2xl">⏹</span>
        ) : (
          <span className="text-2xl">🎤</span>
        )}
      </Button>
      <p className="text-zinc-400 text-sm">
        {isRecording ? 'Listening... Click to stop' : 'Click to speak'}
      </p>
      {transcript && (
        <p className="text-zinc-500 text-sm italic">{transcript}</p>
      )}
    </div>
  )
}