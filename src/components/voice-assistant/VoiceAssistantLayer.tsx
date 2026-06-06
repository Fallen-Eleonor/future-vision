import { useLocation } from 'react-router-dom'
import { VOICE_ASSISTANT_PATHS } from './config'
import { VoiceAssistantWidget } from './VoiceAssistantWidget'

export function VoiceAssistantLayer() {
  const { pathname } = useLocation()
  const visible = VOICE_ASSISTANT_PATHS.some((p) => pathname.startsWith(p))

  if (!visible) return null

  return <VoiceAssistantWidget />
}
