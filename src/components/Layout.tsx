import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
  variant?: 'landing' | 'app'
  showNav?: boolean
}

export function Layout({ children, variant = 'app', showNav = false }: Props) {
  return (
    <div className={`layout layout-${variant}`}>
      {variant === 'app' && (
        <div className="bio-bg" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
        </div>
      )}

      {showNav && (
        <header className="top-nav">
          <Link to="/" className="brand">
            Foresight
          </Link>
          <span className="brand-tag">Meet your future self</span>
        </header>
      )}

      <main className={variant === 'landing' ? 'landing-shell' : 'page-shell'}>{children}</main>
    </div>
  )
}
