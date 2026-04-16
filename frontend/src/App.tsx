import { Button } from '@/components/ui/button'
import AudioVisualizer from '@/components/scene/AudioVisualizer'
import ChatPanel from '@/components/chat/ChatPanel'
import SettingsDialog from '@/components/settings/SettingsDialog'
import VoiceInput from '@/components/VoiceInput'
import { useVoiceAIStore } from '@/store/voiceAI'

function App() {
  const { toggleSettings } = useVoiceAIStore()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Voice AI</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSettings}
          className="text-zinc-400 hover:text-zinc-100"
        >
          ⚙️ Settings
        </Button>
      </header>

      <main className="h-[calc(100vh-65px)] grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 border-r border-zinc-800">
          <div className="w-full h-[400px] mb-8">
            <AudioVisualizer />
          </div>
          <VoiceInput />
        </div>

        <div className="p-6 h-full">
          <ChatPanel />
        </div>
      </main>

      <SettingsDialog />
    </div>
  )
}

export default App