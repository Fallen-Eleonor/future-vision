import { useState, type CSSProperties } from 'react'
import { Button } from './Button'
import type { RiskResult, WellnessResult } from '../types'

type Props = {
  risk: RiskResult
  wellness: WellnessResult
  mode: 'now' | 'plus10'
}

function riskLabel(band: RiskResult['riskBand']): string {
  if (band === 'low') return 'Low'
  if (band === 'moderate') return 'Moderate'
  return 'High'
}

function riskLabelClass(band: RiskResult['riskBand']): string {
  if (band === 'low') return 'good'
  if (band === 'moderate') return 'moderate'
  return 'high'
}

function wellnessShortLabel(score: number): string {
  if (score >= 70) return 'Good'
  if (score >= 45) return 'Fair'
  return 'Needs focus'
}

function wellnessMessage(score: number): string {
  if (score >= 70) return "You're building healthy momentum."
  if (score >= 45) return 'Small shifts can move this score up.'
  return 'Your trajectory is still changeable.'
}

function factorStatus(impact: 'positive' | 'neutral' | 'negative'): string {
  if (impact === 'positive') return 'Good'
  if (impact === 'neutral') return 'Moderate'
  return 'Moderate'
}

function factorDots(impact: 'positive' | 'neutral' | 'negative'): number {
  if (impact === 'positive') return 5
  if (impact === 'neutral') return 3
  return 2
}

function factorTheme(impact: 'positive' | 'neutral' | 'negative'): string {
  if (impact === 'positive') return 'green'
  if (impact === 'neutral') return 'blue'
  return 'purple'
}

function WellnessGauge({ score }: { score: number }) {
  return (
    <div
      className="wellness-gauge"
      style={{ '--score': score } as CSSProperties}
      role="img"
      aria-label={`Wellness score ${score} out of 100`}
    >
      <div className="wellness-gauge-ring" />
      <div className="wellness-gauge-center">
        <span className="wellness-gauge-score">{score}</span>
        <span className="wellness-gauge-max">/100</span>
      </div>
    </div>
  )
}

export function RevealResultsPanel({ risk, wellness, mode }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const displayRisk = mode === 'now' ? risk.riskPercent : risk.projectedPlus10
  const displayWellness =
    mode === 'now' ? wellness.score : Math.max(12, wellness.score - Math.round(risk.projectedPlus10 / 8))
  const riskMarker = Math.min(100, (displayRisk / 50) * 100)

  return (
    <div className="reveal-results">
      <h1 className="page-title page-title--sm">Your future is still movable.</h1>
      <p className="page-subtitle reveal-results-sub">
        Here&apos;s your 10-year outlook and what&apos;s in your control.
      </p>

      <div className="reveal-metrics-row">
        <div className="reveal-metric-card">
          <span className="reveal-metric-label">10-year type-2 diabetes risk</span>
          <div className="reveal-risk-value-row">
            <span className="reveal-risk-value">{displayRisk}%</span>
            <span className={`reveal-risk-badge ${riskLabelClass(risk.riskBand)}`}>
              <span className="reveal-risk-dot" />
              {mode === 'now' ? riskLabel(risk.riskBand) : 'Projected'}
            </span>
          </div>
          <div className="reveal-risk-bar">
            <div className="reveal-risk-bar-fill" />
            <span className="reveal-risk-marker" style={{ left: `${riskMarker}%` }} />
          </div>
        </div>

        <div className="reveal-metric-card reveal-wellness-card">
          <span className="reveal-metric-label">Wellness Score</span>
          <div className="reveal-wellness-row">
            <WellnessGauge score={displayWellness} />
            <div className="reveal-wellness-copy">
              <span className="reveal-wellness-label">{wellnessShortLabel(displayWellness)}</span>
              <p>{wellnessMessage(displayWellness)}</p>
            </div>
          </div>
        </div>
      </div>

      <ul className="reveal-factor-list">
        {wellness.factors.map((f) => {
          const theme = factorTheme(f.impact)
          const filled = factorDots(f.impact)
          const name = f.name === 'BMI context' ? 'BMI range' : f.name
          return (
            <li key={f.name} className="reveal-factor-row">
              <span className={`reveal-factor-icon ${theme}`} aria-hidden="true" />
              <div className="reveal-factor-main">
                <span className="reveal-factor-name">{name}</span>
                <span className={`reveal-factor-status ${theme}`}>{factorStatus(f.impact)}</span>
              </div>
              <div className="reveal-factor-dots" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className={i < filled ? `on ${theme}` : ''} />
                ))}
              </div>
              <span className="reveal-factor-chevron">›</span>
            </li>
          )
        })}
      </ul>

      <div className="reveal-findrisc-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path d="M12 8v5M12 16h.01" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Based on validated FINDRISC screening inputs · score {risk.findriscScore}
      </div>

      <p className="reveal-next-hint">Ready to change course? Build a personalized plan from these results.</p>

      <Button arrow to="/optimizer" className="btn-teal--block">
        Open action plan
      </Button>

      <button type="button" className="reveal-details-link" onClick={() => setDetailsOpen((v) => !v)}>
        View scoring details {detailsOpen ? '↑' : '↓'}
      </button>

      {detailsOpen && (
        <div className="reveal-details">
          {wellness.factors.map((f) => (
            <p key={f.name}>
              <strong>{f.name}:</strong> {f.note}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
