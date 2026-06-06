import { Navigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { RevealAvatarTriptych } from '../components/RevealAvatarTriptych'
import { RevealResultsPanel } from '../components/RevealResultsPanel'
import { useApp } from '../context/AppContext'

export function RevealPage() {
  const { state, risk, wellness } = useApp()

  if (!state.profile || !risk || !wellness) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <AppShell>
      <p className="page-breadcrumb">Reveal · Compare now vs +10 years</p>
      <div className="split-layout split-layout--reveal">
        <RevealAvatarTriptych
          portraitUrl={state.profile.portraitUrl}
          wellnessScore={wellness.score}
        />
        <RevealResultsPanel risk={risk} wellness={wellness} mode="now" />
      </div>
    </AppShell>
  )
}
