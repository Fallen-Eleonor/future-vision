const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const appleHealthDemo = {
  stepsToday: 8420,
  stepsGoal: 10000,
  restingHr: 62,
  sleepHours: 7.2,
  hrv: 48,
  weightKg: 81.4,
  weeklySteps: [6200, 7100, 5400, 8900, 7600, 8420, 9100],
  dayLabels: DAY_LABELS,
}

export const appleWatchDemo = {
  heartRateNow: 74,
  restingHr: 62,
  activeCalories: 420,
  activeCaloriesGoal: 500,
  exerciseMinutes: 38,
  exerciseGoal: 30,
  standHours: 10,
  standGoal: 12,
  hourlyHeartRate: [
    58, 57, 56, 55, 58, 62, 71, 78, 82, 76, 72, 68,
    70, 74, 79, 85, 88, 82, 76, 72, 69, 66, 64, 61,
  ],
  timeLabels: Array.from({ length: 24 }, (_, i) => {
    const h = (new Date().getHours() - 23 + i + 24) % 24
    return `${h.toString().padStart(2, '0')}:00`
  }),
  weeklyActiveCalories: [310, 380, 290, 450, 410, 420, 395],
  dayLabels: DAY_LABELS,
}
