import type { ActivityLevel, Profile, RiskBand, RiskResult } from '../types'

function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

function activityPoints(activity: ActivityLevel): number {
  return activity === 'regular_gym' || activity === 'active' ? 0 : 2
}

function agePoints(ageBand: Profile['ageBand']): number {
  switch (ageBand) {
    case '<45':
      return 0
    case '45-54':
      return 2
    case '55-64':
      return 3
    case '65+':
      return 4
  }
}

function bmiPoints(value: number): number {
  if (value < 25) return 0
  if (value <= 30) return 1
  return 2
}

function waistPoints(waistCm: number | undefined, bmiValue: number): number {
  if (!waistCm) return 0
  const threshold = bmiValue >= 25 ? 94 : 80
  return waistCm > threshold ? 3 : 0
}

function familyPoints(history: Profile['familyHistory']): number {
  switch (history) {
    case 'none':
      return 0
    case 'second_degree':
      return 3
    case 'first_degree':
      return 5
  }
}

function riskFromScore(score: number): { percent: number; category: string; band: RiskBand } {
  if (score < 7) return { percent: 1, category: 'Low risk', band: 'low' }
  if (score <= 11) return { percent: 4, category: 'Slightly elevated', band: 'moderate' }
  if (score <= 14) return { percent: 17, category: 'Moderate risk', band: 'moderate' }
  if (score <= 20) return { percent: 33, category: 'High risk', band: 'high' }
  return { percent: 50, category: 'Very high risk', band: 'high' }
}

export function computeFindrisc(profile: Profile): RiskResult {
  const bmiValue = bmi(profile.weightKg, profile.heightCm)
  const score =
    agePoints(profile.ageBand) +
    bmiPoints(bmiValue) +
    waistPoints(profile.waistCm, bmiValue) +
    activityPoints(profile.activity) +
    (profile.fruitVegDaily ? 0 : 1) +
    (profile.bpMedication ? 2 : 0) +
    (profile.highBloodGlucose ? 5 : 0) +
    familyPoints(profile.familyHistory)

  const mapped = riskFromScore(score)
  const projectedPlus10 = Math.min(95, Math.round(mapped.percent * 1.65 + (profile.activity === 'sedentary' ? 8 : 3)))

  return {
    findriscScore: score,
    riskPercent: mapped.percent,
    riskBand: mapped.band,
    category: mapped.category,
    projectedPlus10,
  }
}

export function computeBmi(weightKg: number, heightCm: number): number {
  return Math.round(bmi(weightKg, heightCm) * 10) / 10
}
