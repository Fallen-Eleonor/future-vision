import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export type OnboardingStepDef = {
  id: number
  title: string
  kicker: string
  optional?: boolean
  icon: 'welcome' | 'profile' | 'body' | 'lifestyle' | 'risk' | 'extras'
}

export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  { id: 0, title: 'Intro', kicker: 'Welcome', icon: 'welcome' },
  { id: 1, title: 'Profile', kicker: 'Your name', icon: 'profile' },
  { id: 2, title: 'Body', kicker: 'Metrics', icon: 'body' },
  { id: 3, title: 'Lifestyle', kicker: 'Habits', icon: 'lifestyle' },
  { id: 4, title: 'Risk quiz', kicker: 'FINDRISC', icon: 'risk' },
  { id: 5, title: 'Extras', kicker: 'Optional', icon: 'extras', optional: true },
]

type Props = {
  currentStep: number
  onStepClick: (step: number) => void
}

function StepIcon({ type, active }: { type: OnboardingStepDef['icon']; active: boolean }) {
  const paths: Record<OnboardingStepDef['icon'], ReactNode> = {
    welcome: (
      <>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeWidth="1.5" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" strokeWidth="1.5" />
        <path d="M5 19c0-3.5 3-6 7-6s7 2.5 7 6" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    body: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.5" />
        <path d="M9 7h6M9 11h6M9 15h4" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    lifestyle: (
      <>
        <path d="M13 5l-2 8H7l6 10 2-8h4L13 5z" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    risk: (
      <>
        <path d="M12 3L4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-4z" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 8v5M12 16h.01" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    extras: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
        <path d="M12 8v8M8 12h8" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <span className={`onboarding-sidebar-icon ${active ? 'active' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        {paths[type]}
      </svg>
    </span>
  )
}

function stepStatus(index: number, current: number): 'done' | 'active' | 'upcoming' {
  if (index < current) return 'done'
  if (index === current) return 'active'
  return 'upcoming'
}

function stepLabel(index: number, current: number, total: number, optional?: boolean) {
  const status = stepStatus(index, current)
  if (status === 'active') return `STEP ${index + 1} OF ${total}`
  if (optional && status === 'upcoming') return 'OPTIONAL'
  if (status === 'upcoming') return 'UPCOMING'
  return `STEP ${index + 1}`
}

export function OnboardingSidebar({ currentStep, onStepClick }: Props) {
  const total = ONBOARDING_STEPS.length

  return (
    <aside className="onboarding-sidebar">
      <Link to="/" className="onboarding-sidebar-brand">
        Future Vision
      </Link>

      <nav className="onboarding-sidebar-nav" aria-label="Onboarding steps">
        <ul>
          {ONBOARDING_STEPS.map((item) => {
            const status = stepStatus(item.id, currentStep)
            const clickable = status === 'done'

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`onboarding-sidebar-item ${status}`}
                  disabled={!clickable}
                  aria-current={status === 'active' ? 'step' : undefined}
                  onClick={() => clickable && onStepClick(item.id)}
                >
                  <StepIcon type={item.icon} active={status === 'active'} />
                  <span className="onboarding-sidebar-text">
                    <span className="onboarding-sidebar-title">{item.title}</span>
                    <span className="onboarding-sidebar-kicker">
                      {stepLabel(item.id, currentStep, total, item.optional)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="onboarding-sidebar-help">
        <span className="onboarding-sidebar-avatar" aria-hidden="true">
          K
        </span>
        <div>
          <p className="onboarding-sidebar-help-title">Need help?</p>
          <p className="onboarding-sidebar-help-sub">Ask your wellness guide</p>
        </div>
      </div>
    </aside>
  )
}
