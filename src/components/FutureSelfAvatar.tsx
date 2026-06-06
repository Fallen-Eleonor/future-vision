import type { ReactNode } from 'react'
import { Avatar3DView } from './avatar/Avatar3DView'
import { AVATAR_NOW_URL, type AvatarScenario } from '../data/assets'
import { scenarioVisuals } from '../data/scenarios'
import type { FutureScenario } from '../types'

type Props = {
  mode: 'now' | 'plus10'
  onModeChange: (mode: 'now' | 'plus10') => void
  scenario: FutureScenario
  portraitUrl?: string
  showToggle?: boolean
  overlay?: ReactNode
  vitality?: number
  modelUrl?: string
  variant?: AvatarScenario
}

export function FutureSelfAvatar({
  mode,
  onModeChange,
  scenario,
  portraitUrl,
  showToggle = true,
  overlay,
  vitality = 70,
  modelUrl,
  variant,
}: Props) {
  const visual = scenarioVisuals[scenario]
  const src = portraitUrl ?? AVATAR_NOW_URL
  const usesScenarioModel = Boolean(modelUrl && variant)
  const future = usesScenarioModel ? false : mode === 'plus10'
  const hologram = usesScenarioModel ? false : future

  return (
    <div className="reveal-avatar-panel">
      <div
        className={`reveal-avatar-frame ${future ? 'reveal-avatar-future' : ''} ${hologram ? 'reveal-avatar-frame--hologram' : ''} ${variant ? `reveal-avatar-frame--${variant === 'best' ? 'good' : variant === 'worst' ? 'bad' : 'neutral'}` : ''}`}
      >
        <Avatar3DView
          key={`${variant ?? 'default'}-${mode}`}
          future={future}
          hologram={hologram}
          vitality={vitality}
          fallbackSrc={src}
          modelUrl={modelUrl}
          variant={variant}
        />

        {overlay && <div className="reveal-avatar-overlay">{overlay}</div>}

        {showToggle && (
          <div className="reveal-avatar-toggle">
            <button
              type="button"
              className={mode === 'now' ? 'active' : ''}
              onClick={() => onModeChange('now')}
            >
              Now
            </button>
            <button
              type="button"
              className={mode === 'plus10' ? 'active' : ''}
              onClick={() => onModeChange('plus10')}
            >
              +10 years
            </button>
          </div>
        )}

        <div className="reveal-avatar-quote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              d="M12 3L4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-4z"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <p>
            {usesScenarioModel || mode === 'plus10'
              ? visual.message
              : 'Small choices today shape a stronger tomorrow.'}
          </p>
        </div>
      </div>
    </div>
  )
}
