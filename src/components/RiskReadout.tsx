import { evidenceRefs } from '../data/scenarios'
import type { RiskResult, WellnessResult } from '../types'

type Props = {
  risk: RiskResult
  wellness: WellnessResult
  mode: 'now' | 'plus10'
  name?: string
}

export function RiskReadout({ risk, wellness, mode, name }: Props) {
  const displayRisk = mode === 'now' ? risk.riskPercent : risk.projectedPlus10
  const headline =
    mode === 'now'
      ? `${name ? `${name}, your` : 'Your'} current screening snapshot`
      : 'If this lifestyle continues for 10 years'

  return (
    <div className="risk-readout">
      <p className="eyebrow">{headline}</p>

      <div className="metric-row">
        <div className="metric-card">
          <span className="metric-label">10-yr T2D risk</span>
          <span className="metric-value">{displayRisk}%</span>
          <span className="metric-sub">{mode === 'now' ? risk.category : 'Projected trajectory'}</span>
        </div>
        <div className="metric-card accent">
          <span className="metric-label">Wellness Score</span>
          <span className="metric-value">{wellness.score}</span>
          <span className="metric-sub">{wellness.label}</span>
        </div>
      </div>

      <div className="findrisc-badge">
        FINDRISC score <strong>{risk.findriscScore}</strong> — validated screening, not diagnosis
      </div>

      <ul className="factor-list">
        {wellness.factors.map((f) => (
          <li key={f.name} className={`factor factor-${f.impact}`}>
            <span className="factor-name">{f.name}</span>
            <span className="factor-note">{f.note}</span>
          </li>
        ))}
      </ul>

      <details className="evidence">
        <summary>Clinical evidence references</summary>
        <ul>
          {evidenceRefs.map((ref) => (
            <li key={ref}>{ref}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}
