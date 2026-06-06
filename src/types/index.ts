export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'active'
  | 'regular_gym'

export type DietPattern = 'omnivore' | 'vegetarian' | 'vegan'

export type Frequency = 'never' | 'sometimes' | 'often' | 'daily'

export type RiskBand = 'low' | 'moderate' | 'high'

export type FutureScenario =
  | 'now'
  | 'plus10_current'
  | 'adhered_2'
  | 'adhered_5'
  | 'adhered_10'
  | 'worsening_2'
  | 'worsening_5'
  | 'worsening_10'

export type Profile = {
  name: string
  heightCm: number
  weightKg: number
  waistCm?: number
  activity: ActivityLevel
  dietPattern: DietPattern
  sugaryDrinks: Frequency
  junkFood: Frequency
  fruitVegDaily: boolean
  ageBand: '<45' | '45-54' | '55-64' | '65+'
  bpMedication: boolean
  highBloodGlucose: boolean
  familyHistory: 'none' | 'second_degree' | 'first_degree'
  portraitUrl?: string
  insurance?: string
}

export type RiskResult = {
  findriscScore: number
  riskPercent: number
  riskBand: RiskBand
  category: string
  projectedPlus10: number
}

export type WellnessResult = {
  score: number
  label: string
  factors: { name: string; impact: 'positive' | 'neutral' | 'negative'; note: string }[]
}

export type PlanAction = {
  category: 'diet' | 'activity' | 'sleep' | 'lifestyle'
  title: string
  detail: string
}

export type HealthGoal = {
  id: string
  title: string
  done: boolean
}

export type MealLog = {
  id: string
  date: string
  label: string
  glycemicImpact: 'low' | 'medium' | 'high'
  macros: { carbs: number; protein: number; fat: number }
  swap: string
}

export type AppState = {
  profile: Profile | null
  risk: RiskResult | null
  wellness: WellnessResult | null
  plan: PlanAction[]
  goals: HealthGoal[]
  meals: MealLog[]
  streakDays: boolean[]
  devicesConnected: { appleHealth: boolean; watch: boolean; cgm: boolean }
  disclaimerAccepted: boolean
}

export const defaultProfile: Profile = {
  name: '',
  heightCm: 175,
  weightKg: 82,
  activity: 'sedentary',
  dietPattern: 'omnivore',
  sugaryDrinks: 'often',
  junkFood: 'sometimes',
  fruitVegDaily: false,
  ageBand: '45-54',
  bpMedication: false,
  highBloodGlucose: false,
  familyHistory: 'first_degree',
}
