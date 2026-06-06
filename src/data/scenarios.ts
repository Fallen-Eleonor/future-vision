import type { FutureScenario, RiskBand } from '../types'

export type ScenarioVisual = {
  label: string
  vitality: number
  hue: number
  pulse: number
  particles: number
  message: string
}

export const scenarioVisuals: Record<FutureScenario, ScenarioVisual> = {
  now: {
    label: 'Now',
    vitality: 72,
    hue: 168,
    pulse: 1,
    particles: 24,
    message: 'Present-day vitality baseline',
  },
  plus10_current: {
    label: '+10 years',
    vitality: 38,
    hue: 12,
    pulse: 0.55,
    particles: 10,
    message: 'If current habits continue',
  },
  adhered_2: {
    label: '2 years · Adhered',
    vitality: 78,
    hue: 155,
    pulse: 1.1,
    particles: 28,
    message: 'Early wins from consistent change',
  },
  adhered_5: {
    label: '5 years · Adhered',
    vitality: 86,
    hue: 142,
    pulse: 1.2,
    particles: 32,
    message: 'Sustained habits compound',
  },
  adhered_10: {
    label: '10 years · Adhered',
    vitality: 94,
    hue: 130,
    pulse: 1.35,
    particles: 40,
    message: 'Future self with protected vitality',
  },
  worsening_2: {
    label: '2 years · Declining',
    vitality: 58,
    hue: 28,
    pulse: 0.75,
    particles: 16,
    message: 'Early drift without intervention',
  },
  worsening_5: {
    label: '5 years · Declining',
    vitality: 42,
    hue: 18,
    pulse: 0.6,
    particles: 12,
    message: 'Fatigue and clarity loss accelerate',
  },
  worsening_10: {
    label: '10 years · Declining',
    vitality: 24,
    hue: 4,
    pulse: 0.4,
    particles: 6,
    message: 'Mobility and energy significantly reduced',
  },
}

export function riskNarrative(band: RiskBand, projected: number): string {
  const base =
    band === 'low'
      ? 'Your screening score suggests a lower 10-year trajectory.'
      : band === 'moderate'
        ? 'Moderate screening risk — small habit shifts can meaningfully bend this curve.'
        : 'Elevated screening risk — the good news is many drivers here are modifiable.'

  return `${base} On current path, projected risk rises toward ~${projected}% over 10 years. This is validated screening, not a diagnosis.`
}

export const evidenceRefs = [
  'FINDRISC — Finnish Diabetes Risk Score (Lindström & Tuomilehto)',
  'Hershfield et al. — Future-self continuity reduces present bias',
  'ADA Standards of Care — Lifestyle intervention for prediabetes',
]
