import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Settings {
  openaiApiKey: string
  elevenlabsApiKey: string
  voiceId: string
  model: string
}

interface VoiceAIState {
  messages: Message[]
  isRecording: boolean
  isSpeaking: boolean
  settings: Settings
  isSettingsOpen: boolean
  audioLevel: number

  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setRecording: (isRecording: boolean) => void
  setSpeaking: (isSpeaking: boolean) => void
  setSettings: (settings: Partial<Settings>) => void
  toggleSettings: () => void
  setAudioLevel: (level: number) => void
  clearChat: () => void
}

export const useVoiceAIStore = create<VoiceAIState>((set) => ({
  messages: [],
  isRecording: false,
  isSpeaking: false,
  settings: {
    openaiApiKey: '',
    elevenlabsApiKey: '',
    voiceId: '21m00Tcm4t28jz12R00', // Default ElevenLabs voice
    model: 'gpt-4o-mini',
  },
  isSettingsOpen: false,
  audioLevel: 0,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  setRecording: (isRecording) => set({ isRecording }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  clearChat: () => set({ messages: [] }),
}))