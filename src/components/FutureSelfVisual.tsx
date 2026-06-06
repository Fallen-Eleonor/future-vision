import type { CSSProperties } from 'react'
import { HERO_ORB_URL } from '../data/assets'
import { scenarioVisuals } from '../data/scenarios'
import type { FutureScenario } from '../types'
import { HeroOrb } from './HeroOrb'

type Props = {
  scenario: FutureScenario
  compact?: boolean
}

export function FutureSelfVisual({ scenario, compact = false }: Props) {
  const visual = scenarioVisuals[scenario]

  const style = {
    '--vitality': visual.vitality,
    '--hue': visual.hue,
    '--pulse': visual.pulse,
  } as CSSProperties

  return (
    <div
      className={`future-self-scene ${compact ? 'future-self-scene-compact' : ''}`}
      style={style}
    >
      <div className="future-self-backdrop" aria-hidden="true">
        <div className="future-self-backdrop-glow" />
        <div className="future-self-backdrop-ring future-self-backdrop-ring-a" />
        <div className="future-self-backdrop-ring future-self-backdrop-ring-b" />
        <img
          src={HERO_ORB_URL}
          alt=""
          className="future-self-backdrop-orb"
          draggable={false}
        />
      </div>

      <div className="future-self-scene-particles" aria-hidden="true">
        {Array.from({ length: visual.particles + 8 }).map((_, i) => (
          <span key={i} className="scene-particle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <div className={`future-self liquid-glass-visual ${compact ? 'future-self-compact' : ''}`}>
        <div className="liquid-glass-visual-aura" aria-hidden="true" />
        <div className="liquid-glass-visual-shine" aria-hidden="true" />

        <div className="future-self-stage">
          <div className="future-self-droplet" aria-hidden="true">
            <div className="future-self-orbit future-self-orbit-a" />
            <div className="future-self-orbit future-self-orbit-b" />
            <HeroOrb size="embedded" />
          </div>
        </div>

        <div className="future-self-caption liquid-glass-chip">
          <span className="future-self-label">{visual.label}</span>
          <span className="future-self-message">{visual.message}</span>
          <div className="vitality-bar">
            <div className="vitality-fill" style={{ width: `${visual.vitality}%` }} />
          </div>
          <span className="vitality-text">Vitality index {visual.vitality}</span>
        </div>
      </div>
    </div>
  )
}
