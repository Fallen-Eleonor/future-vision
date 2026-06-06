import type { ReactNode } from 'react'
import { ConversationProvider } from '@elevenlabs/react'
import { ELEVENLABS_AGENT_ID, ELEVENLABS_API_KEY } from './config'

type Props = {
  children: ReactNode
}

export function VoiceAssistantProvider({ children }: Props) {
  return (
    <ConversationProvider
      agentId={ELEVENLABS_AGENT_ID}
      connectionType="websocket"
      authorization={ELEVENLABS_API_KEY || undefined}
    >
      {children}
    </ConversationProvider>
  )
}
