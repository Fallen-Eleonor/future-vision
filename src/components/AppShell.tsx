import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  JOURNEY_ROUTES,
  isJourneyUnlocked,
  journeyIdFromPath,
  type JourneyId,
} from '../navigation/routes'
import { BrandLogo } from './BrandLogo'
import { journeyIcon, NavIconArrow, NavIconLock } from './NavIcons'

export type PageAction = {
  label: string
  to?: string
  onClick?: () => void
}

type HeaderProps = {
  pageAction?: PageAction
}

export function AppHeader({ pageAction }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useApp()
  const hasSession = Boolean(state.profile)
  const current = journeyIdFromPath(location.pathname)
  const onLanding = current === 'home'

  const handleJourneyClick = (id: JourneyId, path: string) => {
    if (!isJourneyUnlocked(id, hasSession)) return
    navigate(path)
  }

  const runPageAction = () => {
    if (!pageAction) return
    if (pageAction.onClick) pageAction.onClick()
    else if (pageAction.to) navigate(pageAction.to)
  }

  return (
    <header className="app-header">
      <div className="app-header-start">
        <Link to="/" className="app-brand" title="Home">
          <BrandLogo />
          <span className="app-brand-text">Future Vision</span>
        </Link>
      </div>

      <nav className="journey-nav" aria-label="App sections">
        {JOURNEY_ROUTES.map((route) => {
          const unlocked = isJourneyUnlocked(route.id, hasSession)
          const isActive = current === route.id
          const isDone = hasSession && route.id === 'setup' && current !== 'setup'

          return (
            <button
              key={route.id}
              type="button"
              className={`journey-nav-item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''} ${!unlocked ? 'is-locked' : ''}`}
              disabled={!unlocked}
              title={unlocked ? route.description : 'Complete Setup first'}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleJourneyClick(route.id, route.path)}
            >
              <span className="journey-nav-icon">{journeyIcon(route.id, 18)}</span>
              <span className="journey-nav-label">{route.label}</span>
              {!unlocked && (
                <span className="journey-nav-lock">
                  <NavIconLock size={12} />
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="app-header-end">
        <div className="app-header-action-slot">
          {onLanding ? (
            <Link to="/onboarding" className="btn-teal btn-sm">
              Start setup
              <NavIconArrow size={14} />
            </Link>
          ) : pageAction?.to ? (
            <Link to={pageAction.to} className="btn-teal btn-sm">
              {pageAction.label}
              <NavIconArrow size={14} />
            </Link>
          ) : pageAction ? (
            <button type="button" className="btn-teal btn-sm" onClick={runPageAction}>
              {pageAction.label}
              <NavIconArrow size={14} />
            </button>
          ) : (
            <span className="app-header-action-placeholder btn-teal btn-sm" aria-hidden="true">
              Open action plan
              <NavIconArrow size={14} />
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

export function AppFooter() {
  return (
    <footer className="app-footer">
      Educational wellness tool · FINDRISC screening · Not a diagnosis
    </footer>
  )
}

type ShellProps = {
  children: ReactNode
  pageAction?: PageAction
  flat?: boolean
  landing?: boolean
  showHeader?: boolean
  showFooter?: boolean
}

export function AppShell({
  children,
  pageAction,
  flat = false,
  landing = false,
  showHeader = !landing,
  showFooter = !landing,
}: ShellProps) {
  return (
    <div className={`app-shell ${landing ? 'app-shell--landing' : ''}`}>
      <div
        className={`app-container ${flat ? 'app-container--flat' : ''} ${landing ? 'app-container--landing' : ''}`}
      >
        {showHeader && <AppHeader pageAction={pageAction} />}
        <div className={`app-content ${landing ? 'app-content--landing' : ''}`}>{children}</div>
        {showFooter && <AppFooter />}
      </div>
    </div>
  )
}
