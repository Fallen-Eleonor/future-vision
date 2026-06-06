import type { JourneyId } from '../navigation/routes'

type IconProps = { size?: number; className?: string }

export function NavIconSetup({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeWidth="1.75" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" strokeWidth="1.75" />
      <path d="M9 12h6M9 16h4" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function NavIconReveal({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle cx="9" cy="10" r="3" strokeWidth="1.75" />
      <circle cx="16" cy="10" r="3" strokeWidth="1.75" strokeDasharray="3 2" />
      <path d="M6 18c0-2 1.5-3 3-3s3 1 3 3M13 18c0-2 1.2-3 3-3" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function NavIconPlan({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <path d="M4 18l4-8 4 5 4-9 4 12" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NavIconTrack({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.75" />
      <path d="M8 8h2v8H8zM11 11h2v5h-2zM14 6h2v10h-2z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function NavIconHome({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  )
}

export function NavIconLock({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeWidth="1.75" />
    </svg>
  )
}

export function NavIconArrow({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function journeyIcon(id: JourneyId | 'home', size = 20) {
  switch (id) {
    case 'setup':
      return <NavIconSetup size={size} />
    case 'reveal':
      return <NavIconReveal size={size} />
    case 'plan':
      return <NavIconPlan size={size} />
    case 'track':
      return <NavIconTrack size={size} />
    case 'home':
      return <NavIconHome size={size} />
  }
}
