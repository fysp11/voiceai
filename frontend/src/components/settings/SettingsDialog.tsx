import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useVoiceAIStore } from '@/store/voiceAI'

export default function SettingsDialog() {
  const { settings, setSettings, isSettingsOpen, toggleSettings } = useVoiceAIStore() as any
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings, isSettingsOpen])

  const handleSave = () => {
    setSettings(localSettings)
    toggleSettings()
  }

  return (
    <Dialog open={isSettingsOpen} onOpenChange={toggleSettings}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and voice settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="openai" className="text-zinc-300">
              OpenAI API Key
            </Label>
            <Input
              id="openai"
              type="password"
              value={localSettings.openaiApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })
              }
              placeholder="sk-..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="elevenlabs" className="text-zinc-300">
              ElevenLabs API Key
            </Label>
            <Input
              id="elevenlabs"
              type="password"
              value={localSettings.elevenlabsApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalSettings({ ...localSettings, elevenlabsApiKey: e.target.value })
              }
              placeholder="..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="voiceId" className="text-zinc-300">
              ElevenLabs Voice ID
            </Label>
            <Input
              id="voiceId"
              value={localSettings.voiceId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalSettings({ ...localSettings, voiceId: e.target.value })
              }
              placeholder="21m00Tcm4t28jz12R00"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model" className="text-zinc-300">
              OpenAI Model
            </Label>
            <Input
              id="model"
              value={localSettings.model}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalSettings({ ...localSettings, model: e.target.value })
              }
              placeholder="gpt-4o-mini"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}