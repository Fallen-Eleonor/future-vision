import type { CSSProperties } from 'react'

type Props = {
  level: number
  live: boolean
  speaking: boolean
  connecting: boolean
}

export function VoiceAliceCloud({ level, live, speaking, connecting }: Props) {
  const intensity = live ? 0.4 + Math.min(1, level) * 0.6 : 0.35
  const scale = 1 + Math.min(1, level) * 0.45

  const stateClass = [
    'voice-orb',
    live ? 'voice-orb--live' : '',
    speaking ? 'voice-orb--speaking' : '',
    connecting ? 'voice-orb--connecting' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={stateClass}
      style={{ '--orb-intensity': intensity, '--orb-scale': scale } as CSSProperties}
      aria-hidden="true"
    >
      <div className="voice-orb__field">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="voice-orb__wave" style={{ animationDelay: `${i * 0.55}s` }} />
        ))}
        <span className="voice-orb__glow" />
      </div>

      <div className="voice-orb__core" />
    </div>
  )
}
