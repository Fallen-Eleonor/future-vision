import type { Profile, RiskResult, WellnessResult } from '../types'
import { computeBmi } from './findrisc'

export function computeWellnessScore(profile: Profile, risk: RiskResult): WellnessResult {
  const bmiValue = computeBmi(profile.weightKg, profile.heightCm)
  let score = 100 - risk.riskPercent * 1.2 - risk.findriscScore * 1.5

  if (profile.activity === 'regular_gym') score += 12
  else if (profile.activity === 'active') score += 8
  else if (profile.activity === 'lightly_active') score += 4

  if (profile.fruitVegDaily) score += 6
  if (profile.sugaryDrinks === 'never') score += 5
  else if (profile.sugaryDrinks === 'daily') score -= 6

  if (profile.junkFood === 'never') score += 4
  else if (profile.junkFood === 'often' || profile.junkFood === 'daily') score -= 5

  score = Math.max(12, Math.min(92, Math.round(score)))

  const label =
    score >= 70 ? 'Strong vitality trajectory' : score >= 45 ? 'Room to improve' : 'Needs attention'

  const factors = [
    {
      name: 'Physical activity',
      impact:
        profile.activity === 'sedentary'
          ? ('negative' as const)
          : profile.activity === 'regular_gym'
            ? ('positive' as const)
            : ('neutral' as const),
      note:
        profile.activity === 'sedentary'
          ? 'Low movement increases insulin resistance over time'
          : 'Regular movement supports glucose regulation',
    },
    {
      name: 'Diet quality',
      impact: profile.fruitVegDaily ? ('positive' as const) : ('negative' as const),
      note: profile.fruitVegDaily
        ? 'Daily produce intake supports metabolic health'
        : 'Low produce intake is a modifiable risk factor',
    },
    {
      name: 'BMI context',
      impact: bmiValue < 25 ? ('positive' as const) : bmiValue > 30 ? ('negative' as const) : ('neutral' as const),
      note: `Current BMI ${bmiValue} — screening context, not a diagnosis`,
    },
    {
      name: 'Family history',
      impact: profile.familyHistory === 'none' ? ('neutral' as const) : ('negative' as const),
      note:
        profile.familyHistory === 'first_degree'
          ? 'First-degree family history increases baseline risk'
          : 'No major hereditary signal in profile',
    },
  ]

  return { score, label, factors }
}
