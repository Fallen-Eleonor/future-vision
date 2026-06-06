import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppState,
  HealthGoal,
  MealLog,
  PlanAction,
  Profile,
  RiskResult,
  WellnessResult,
} from '../types'
import { defaultProfile } from '../types'
import { computeFindrisc } from '../lib/findrisc'
import { generatePlan } from '../lib/planGenerator'
import { computeWellnessScore } from '../lib/wellnessScore'

type AppContextValue = {
  state: AppState
  draftProfile: Profile
  setDraftProfile: (patch: Partial<Profile>) => void
  acceptDisclaimer: () => void
  completeOnboarding: () => void
  setGoals: (goals: HealthGoal[]) => void
  toggleGoal: (id: string) => void
  addMeal: (meal: Omit<MealLog, 'id'>) => void
  logStreakDay: (index: number, active: boolean) => void
  toggleDevice: (key: keyof AppState['devicesConnected']) => void
  reset: () => void
  risk: RiskResult | null
  wellness: WellnessResult | null
  plan: PlanAction[]
}

const initialState: AppState = {
  profile: null,
  risk: null,
  wellness: null,
  plan: [],
  goals: [],
  meals: [],
  streakDays: Array.from({ length: 28 }, (_, i) => i < 18),
  devicesConnected: { appleHealth: false, watch: false, cgm: false },
  disclaimerAccepted: false,
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)
  const [draftProfile, setDraft] = useState<Profile>(defaultProfile)

  const setDraftProfile = useCallback((patch: Partial<Profile>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const acceptDisclaimer = useCallback(() => {
    setState((s) => ({ ...s, disclaimerAccepted: true }))
  }, [])

  const completeOnboarding = useCallback(() => {
    const risk = computeFindrisc(draftProfile)
    const wellness = computeWellnessScore(draftProfile, risk)
    const plan = generatePlan(draftProfile)
    const goals: HealthGoal[] = plan.slice(0, 4).map((p, i) => ({
      id: `goal-${i}`,
      title: p.title,
      done: false,
    }))

    setState((s) => ({
      ...s,
      profile: { ...draftProfile },
      risk,
      wellness,
      plan,
      goals,
    }))
  }, [draftProfile])

  const setGoals = useCallback((goals: HealthGoal[]) => {
    setState((s) => ({ ...s, goals }))
  }, [])

  const toggleGoal = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
    }))
  }, [])

  const addMeal = useCallback((meal: Omit<MealLog, 'id'>) => {
    setState((s) => ({
      ...s,
      meals: [{ ...meal, id: crypto.randomUUID() }, ...s.meals],
    }))
  }, [])

  const logStreakDay = useCallback((index: number, active: boolean) => {
    setState((s) => {
      const streakDays = [...s.streakDays]
      streakDays[index] = active
      return { ...s, streakDays }
    })
  }, [])

  const toggleDevice = useCallback((key: keyof AppState['devicesConnected']) => {
    setState((s) => ({
      ...s,
      devicesConnected: { ...s.devicesConnected, [key]: !s.devicesConnected[key] },
    }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
    setDraft(defaultProfile)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      draftProfile,
      setDraftProfile,
      acceptDisclaimer,
      completeOnboarding,
      setGoals,
      toggleGoal,
      addMeal,
      logStreakDay,
      toggleDevice,
      reset,
      risk: state.risk,
      wellness: state.wellness,
      plan: state.plan,
    }),
    [
      state,
      draftProfile,
      setDraftProfile,
      acceptDisclaimer,
      completeOnboarding,
      setGoals,
      toggleGoal,
      addMeal,
      logStreakDay,
      toggleDevice,
      reset,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
