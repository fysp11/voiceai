import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useVoiceAIStore } from '@/store/voiceAI'

export default function ChatPanel() {
  const messages = useVoiceAIStore((state) => state.messages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="h-full flex flex-col bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-zinc-100">Conversation</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              Start a conversation by clicking the microphone button
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => useVoiceAIStore.getState().clearChat()}
          className="w-full border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          Clear Chat
        </Button>
      </CardFooter>
    </Card>
  )
}