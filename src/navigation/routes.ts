export type JourneyId = 'setup' | 'reveal' | 'plan' | 'track'

export type JourneyRoute = {
  id: JourneyId
  path: string
  label: string
  description: string
  icon: JourneyId
  requiresSession: boolean
}

export const JOURNEY_ROUTES: JourneyRoute[] = [
  {
    id: 'setup',
    path: '/onboarding',
    label: 'Setup',
    description: 'Profile & risk questions',
    icon: 'setup',
    requiresSession: false,
  },
  {
    id: 'reveal',
    path: '/reveal',
    label: 'Reveal',
    description: 'Now vs +10 years',
    icon: 'reveal',
    requiresSession: true,
  },
  {
    id: 'plan',
    path: '/optimizer',
    label: 'Plan',
    description: 'Optimize your path',
    icon: 'plan',
    requiresSession: true,
  },
  {
    id: 'track',
    path: '/dashboard',
    label: 'Track',
    description: 'Goals & habits',
    icon: 'track',
    requiresSession: true,
  },
]

export function journeyIdFromPath(pathname: string): JourneyId | 'home' {
  if (pathname.startsWith('/onboarding')) return 'setup'
  if (pathname.startsWith('/reveal')) return 'reveal'
  if (pathname.startsWith('/optimizer')) return 'plan'
  if (pathname.startsWith('/dashboard')) return 'track'
  return 'home'
}

export function isJourneyUnlocked(id: JourneyId, hasSession: boolean): boolean {
  const route = JOURNEY_ROUTES.find((r) => r.id === id)
  if (!route) return false
  return !route.requiresSession || hasSession
}
