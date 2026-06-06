import type { PlanAction, Profile } from '../types'

export function generatePlan(profile: Profile): PlanAction[] {
  const actions: PlanAction[] = [
    {
      category: 'activity',
      title: '10-minute movement after meals',
      detail:
        'A short walk after lunch and dinner can improve post-meal glucose handling — start with what feels achievable.',
    },
    {
      category: 'diet',
      title: 'Swap one sugary drink per day',
      detail:
        profile.sugaryDrinks !== 'never'
          ? 'Replace your most frequent sugary drink with water, sparkling water, or unsweetened tea.'
          : 'Keep avoiding sugary drinks — add one extra serving of vegetables at dinner.',
    },
    {
      category: 'diet',
      title: 'Plate method at lunch',
      detail: 'Half vegetables, quarter lean protein, quarter whole grains — no calorie counting required.',
    },
    {
      category: 'sleep',
      title: 'Consistent sleep window',
      detail: 'Aim for the same bedtime ±30 minutes. Poor sleep worsens insulin sensitivity over years.',
    },
    {
      category: 'lifestyle',
      title: 'Weekly check-in with future you',
      detail: `Hi ${profile.name || 'there'} — revisit your Foresight reveal every Sunday to reinforce the long-game mindset.`,
    },
  ]

  if (profile.activity === 'sedentary') {
    actions.unshift({
      category: 'activity',
      title: 'Stand and stretch every hour',
      detail: 'Set a gentle hourly reminder. Breaking sedentary blocks is one of the highest-leverage changes.',
    })
  }

  return actions
}
