# VoiceAI Experiment Interface - Specification

## Project Overview

- **Project Name**: VoiceAI Experiment Interface
- **Type**: Interactive Web Application (Voice AI + 3D Visualization)
- **Core Functionality**: A real-time voice AI agent interface with 3D audio visualization, speech-to-text input, text-to-speech output, and multiple AI provider support
- **Target Users**: Developers and researchers experimenting with voice AI technologies

---

## UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (fixed, h: 56px)                                          │
│ [Logo] VoiceAI Experiment          [Provider ▼] [Settings ⚙️]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────┐  ┌──────────────────┐ │
│  │                                      │  │                  │ │
│  │                                      │  │   CHAT PANEL     │ │
│  │        3D CANVAS                     │  │   (scrollable)   │ │
│  │     (WebGL/Three.js)                 │  │                  │ │
│  │                                      │  │                  │ │
│  │     - Audio Visualizer               │  │                  │ │
│  │     - Avatar/Abstract                 │  │                  │ │
│  │                                      │  │                  │ │
│  └──────────────────────────────────────┘  └──────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────────┐
│  │ INPUT BAR (h: 72px)                                          │
│  │ [🎤 Record] [Text Input Field              ] [Send ➤]        │
│  └──────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop**: >= 1024px - Full layout with side-by-side 3D canvas and chat
- **Tablet**: 768px - 1023px - 3D canvas above, chat below
- **Mobile**: < 768px - Stacked layout, smaller 3D canvas

### Visual Design

#### Color Palette (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0f` | Main background |
| `--bg-secondary` | `#12121a` | Card/panel background |
| `--bg-tertiary` | `#1a1a24` | Input fields, hover states |
| `--accent-primary` | `#6366f1` | Primary buttons, active states (indigo) |
| `--accent-secondary` | `#8b5cf6` | Secondary highlights (violet) |
| `--accent-tertiary` | `#06b6d4` | Audio visualization (cyan) |
| `--text-primary` | `#f8fafc` | Main text |
| `--text-secondary` | `#94a3b8` | Muted text |
| `--text-tertiary` | `#64748b` | Disabled text |
| `--border-color` | `#2e2e3a` | Borders, dividers |
| `--success` | `#22c55e` | Connected states |
| `--error` | `#ef4444` | Error states |
| `--warning` | `#f59e0b` | Warning states |

#### Typography

- **Font Family**: `"JetBrains Mono", "Fira Code", monospace` for UI elements
- **Headings**: `"Space Grotesk", sans-serif` → Changed to `"Instrument Sans", "SF Pro", system-ui`
- **Font Sizes**:
  - Header title: 20px, weight 600
  - Section headers: 14px, weight 600, uppercase, letter-spacing 0.05em
  - Body text: 14px, weight 400
  - Chat messages: 13px
  - Small/meta: 11px

#### Spacing System

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Content padding: 24px
- Component gap: 16px
- Border radius: 8px (cards), 12px (buttons), 24px (input fields)

#### Visual Effects

- **Glassmorphism**: Panels have `backdrop-filter: blur(12px)` with semi-transparent backgrounds
- **Glow effects**: Active audio states emit subtle glow `box-shadow: 0 0 30px rgba(99, 102, 241, 0.3)`
- **Transitions**: All interactive elements use `transition: all 0.2s ease`
- **Audio visualization**: Animated frequency bars/waves with gradient colors

### Components

#### Header
- Logo (left): VoiceAI with gradient text
- Provider selector dropdown (center-right)
- Settings gear icon button (right)
- Height: 56px
- Background: `--bg-secondary` with bottom border

#### 3D Canvas Panel
- Fills available space
- Contains Three.js scene
- Supports multiple visualization modes:
  1. **Audio Visualizer**: Frequency bars, waveform rings reacting to audio
  2. **Abstract Avatar**: Geometric humanoid or abstract shape
  3. **Particle System**: Particles responding to voice amplitude
- Background: Gradient from `--bg-primary` to `--bg-secondary`
- Border: 1px `--border-color`
- Min-height: 400px on desktop

#### Chat Panel
- Scrollable message list
- Auto-scroll to bottom on new messages
- Message bubbles:
  - User: Right-aligned, `--accent-primary` background
  - AI: Left-aligned, `--bg-tertiary` background
- Timestamp display (optional)
- Max-height: scrollable, flex-grow with 3D canvas

#### Input Bar
- Fixed at bottom
- Contains:
  - Microphone button (toggleable, with recording indicator)
  - Text input field (placeholder: "Type a message or press mic...")
  - Send button
- Background: `--bg-secondary`
- Border-top: 1px `--border-color`

#### Settings Modal
- Overlay modal (centered)
- Sections:
  - **API Keys**: Input fields for each provider
  - **Voice Settings**: Voice selection, speed, pitch
  - **Visualization**: Mode selection, sensitivity
  - **Audio**: Input/output device selection
- Close button (X) in top-right

---

## Functionality Specification

### Core Features

#### 1. Voice Input (Speech-to-Text)
- **Web Speech API**: Primary (free, browser-native)
- **Provider support**:
  - OpenAI Whisper (via API)
  - Custom WebSocket providers
- Real-time transcription display
- Push-to-talk and voice activation modes
- Transcription history saved to chat

#### 2. Text-to-Speech Output
- **Web Speech API**: Primary (browser TTS)
- **Provider support**:
  - ElevenLabs API
  - OpenAI TTS
  - Custom API
- Voice selection per provider
- Speed/pitch controls
- Auto-play responses

#### 3. Chat Interface
- Message history (persisted in localStorage)
- Role distinction (user/assistant)
- Markdown rendering (basic)
- Copy message functionality
- Clear chat button
- Auto-scroll to latest

#### 4. 3D Visualization
- Three.js scene via @react-three/fiber
- Visualization modes:
  1. **Frequency Bars**: 32-64 bars responding to audio frequencies
  2. **Waveform Ring**: Circular waveform visualization
  3. **Abstract Avatar**: Geometric shape morphing with voice
  4. **Particle Cloud**: Particles attracted to voice sound
- Smooth animations (60fps target)
- Performance-aware (reduced on low-end devices)

#### 5. Multiple Provider Support
- **Provider interface** (abstract):
  ```typescript
  interface VoiceProvider {
    name: string;
    type: 'stt' | 'tts' | 'both';
    config: Record<string, string>;
    transcribe(audioBlob: Blob): Promise<string>;
    speak(text: string): Promise<AudioBuffer>;
  }
  ```
- Provider switching without restart
- Per-provider configuration
- Fallback on failure

#### 6. Settings Management
- Local storage persistence
- API key encryption (basic)
- Reset to defaults
- Export/import settings

### User Interactions & Flows

#### Primary Flow: Voice Conversation
1. User clicks microphone → Recording starts
2. User speaks → Real-time waveform in 3D view
3. User releases → Transcription completes
4. Text sent to chat → AI processes (mock or real)
5. AI responds → TTS plays → 3D visualizer reacts
6. Response added to chat

#### Alternative Flow: Text Input
1. User types in input field
2. Presses Enter or clicks Send
3. Text added to chat
4. AI responds (processed async)
5. Response shown + TTS plays
6. 3D visualizer reacts to TTS audio

### Data Handling

- **Chat History**: localStorage (`voiceai_chat`)
- **Settings**: localStorage (`voiceai_settings`)
- **Audio Processing**:
  - Web Audio API for analysis
  - MediaRecorder for capture
  - AudioContext for playback

### Edge Cases

1. **No microphone permission**: Show clear error, fallback to text-only
2. **Provider API failure**: Show error toast, enable fallback
3. **Browser incompatibility**: Detect and show compatibility warnings
4. **Large chat history**: Limit to 100 messages, paginate older
5. **Audio playback conflict**: Queue messages, play sequentially

---

## Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme consistently applied across all components
- [ ] 3D canvas renders without WebGL errors
- [ ] Audio visualizer responds in real-time to microphone input
- [ ] Chat messages display with proper styling
- [ ] Settings modal opens and closes smoothly
- [ ] Responsive layout works at all breakpoints

### Functional Checkpoints
- [ ] Microphone recording works in Chrome/Safari/Firefox
- [ ] Speech-to-text transcription appears in chat
- [ ] Text input sends message and receives response
- [ ] Provider switching updates UI correctly
- [ ] Settings persist across page refresh
- [ ] TTS plays audio response
- [ ] 3D visualizer animates on audio

### Performance Checkpoints
- [ ] Page loads in under 3 seconds
- [ ] 3D scene runs at 30+ FPS on mid-range hardware
- [ ] No memory leaks during extended use
- [ ] Audio latency under 500ms for local processing

---

## Technical Implementation

### Tech Stack
- **Framework**: Vite + React 18
- **3D**: @react-three/fiber, @react-three/drei, three.js
- **UI**: Radix UI + custom styling (shadcn/ui approach)
- **State**: Zustand
- **Audio**: Web Audio API, MediaRecorder
- **Storage**: localStorage

### Project Structure
```
src/
├── main.tsx                 # Entry point
├── App.tsx                 # Main app component
├── index.css               # Global styles (CSS variables)
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── CanvasPanel.tsx
│   │   ├── ChatPanel.tsx
│   │   └── InputBar.tsx
│   ├── three/
│   │   ├── Scene3D.tsx
│   │   ├── AudioVisualizer.tsx
│   │   ├── WaveformRing.tsx
│   │   └── ParticleCloud.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   └── Toggle.tsx
│   └── providers/
│       └── SettingsModal.tsx
├── hooks/
│   ├── useAudio.ts
│   ├── useSpeechRecognition.ts
│   ├── useSpeechSynthesis.ts
│   └── useAudioAnalyzer.ts
├── lib/
│   ├── providers/
│   │   ├── index.ts
│   │   ├── webSpeech.ts
│   │   ├── elevenLabs.ts
│   │   └── openAI.ts
│   ├── utils.ts
│   └── constants.ts
├── store/
│   └── useStore.ts
└── types/
    └── index.ts
```

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "three": "^0.159.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.294.0"
  }
}
```