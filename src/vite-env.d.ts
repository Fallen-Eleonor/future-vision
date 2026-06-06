/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ELEVENLABS_AGENT_ID?: string
  readonly VITE_ELEVENLABS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
