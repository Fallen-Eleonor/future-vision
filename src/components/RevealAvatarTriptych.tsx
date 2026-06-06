import { useState } from 'react'
import { Avatar3DView } from './avatar/Avatar3DView'
import { AVATAR_MODEL_URLS, AVATAR_NOW_URL, type AvatarScenario } from '../data/assets'
import { scenarioVisuals } from '../data/scenarios'

type ScenarioOption = {
  id: AvatarScenario
  label: string
  sublabel: string
  vitality: number
  message: string
  tone: 'neutral' | 'good' | 'bad'
}

const SCENARIOS: ScenarioOption[] = [
  {
    id: 'current',
    label: 'You now',
    sublabel: 'Current state',
    vitality: 0,
    message: scenarioVisuals.now.message,
    tone: 'neutral',
  },
  {
    id: 'best',
    label: 'Best path',
    sublabel: '+10 years · Adhered',
    vitality: scenarioVisuals.adhered_10.vitality,
    message: scenarioVisuals.adhered_10.message,
    tone: 'good',
  },
  {
    id: 'worst',
    label: 'Worst path',
    sublabel: '+10 years · Declining',
    vitality: scenarioVisuals.worsening_10.vitality,
    message: scenarioVisuals.worsening_10.message,
    tone: 'bad',
  },
]

type Props = {
  portraitUrl?: string
  wellnessScore: number
}

export function RevealAvatarTriptych({ portraitUrl, wellnessScore }: Props) {
  const [scenario, setScenario] = useState<AvatarScenario>('current')
  const fallback = portraitUrl ?? AVATAR_NOW_URL
  const active = SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[0]
  const vitality = scenario === 'current' ? wellnessScore : active.vitality

  return (
    <div className="reveal-avatar-panel">
      <div className="avatar-scenario-controls avatar-scenario-controls--reveal">
        <div className="pill-toggle pill-toggle--wide reveal-scenario-toggle">
          {SCENARIOS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`reveal-scenario-toggle-btn reveal-scenario-toggle-btn--${option.tone} ${scenario === option.id ? 'active' : ''}`}
              onClick={() => setScenario(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`reveal-avatar-frame reveal-avatar-frame--${active.tone}`}>
        <Avatar3DView
          key={scenario}
          future={false}
          hologram={false}
          vitality={vitality}
          fallbackSrc={fallback}
          modelUrl={AVATAR_MODEL_URLS[scenario]}
          variant={scenario}
        />
      </div>

      <div className="reveal-scenario-caption">
        <span className="reveal-scenario-caption-label">{active.sublabel}</span>
        <p>{active.message}</p>
      </div>
    </div>
  )
}
