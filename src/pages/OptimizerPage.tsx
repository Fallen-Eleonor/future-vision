import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { FutureSelfAvatar } from '../components/FutureSelfAvatar'
import { useApp } from '../context/AppContext'
import { AVATAR_MODEL_URLS, type AvatarScenario } from '../data/assets'
import { scenarioVisuals } from '../data/scenarios'
import type { FutureScenario } from '../types'

export function OptimizerPage() {
  const { state, plan, wellness } = useApp()
  const [horizon, setHorizon] = useState<'now' | 'plus10'>('now')
  const [fork, setFork] = useState<'adhered' | 'worsening'>('adhered')

  if (!state.profile || !state.risk) {
    return <Navigate to="/onboarding" replace />
  }

  const scenario: FutureScenario =
    horizon === 'now' ? 'now' : fork === 'adhered' ? 'adhered_10' : 'worsening_10'

  const avatarVariant: AvatarScenario =
    horizon === 'now' ? 'current' : fork === 'adhered' ? 'best' : 'worst'

  const avatarVitality =
    horizon === 'now' ? (wellness?.score ?? 70) : scenarioVisuals[scenario].vitality

  return (
    <AppShell>
      <p className="page-breadcrumb">Plan · Choose your future fork</p>
      <div className="page-intro page-intro--compact">
        <h1 className="page-title page-title--sm">Build your action plan</h1>
        <p className="page-subtitle">Compare now vs +10 years — adhered or declining.</p>
      </div>

      <div className="split-layout">
        <div className="split-layout-controls split-layout-controls--avatar">
          <div className="avatar-scenario-controls">
            <div className="control-group">
              <span className="control-label">Time horizon</span>
              <div className="pill-toggle">
                <button
                  type="button"
                  className={horizon === 'now' ? 'active' : ''}
                  onClick={() => setHorizon('now')}
                >
                  Now
                </button>
                <button
                  type="button"
                  className={horizon === 'plus10' ? 'active' : ''}
                  onClick={() => setHorizon('plus10')}
                >
                  +10 years
                </button>
              </div>
            </div>

            {horizon === 'plus10' && (
              <div className="control-group">
                <span className="control-label">Scenario</span>
                <div className="pill-toggle pill-toggle--secondary">
                  <button
                    type="button"
                    className={fork === 'adhered' ? 'active' : ''}
                    onClick={() => setFork('adhered')}
                  >
                    ✓ Adhered
                  </button>
                  <button
                    type="button"
                    className={fork === 'worsening' ? 'active' : ''}
                    onClick={() => setFork('worsening')}
                  >
                    ↓ Declining
                  </button>
                </div>
              </div>
            )}
          </div>

          <FutureSelfAvatar
            mode={horizon}
            onModeChange={setHorizon}
            scenario={scenario}
            portraitUrl={state.profile.portraitUrl}
            showToggle={false}
            vitality={avatarVitality}
            modelUrl={AVATAR_MODEL_URLS[avatarVariant]}
            variant={avatarVariant}
          />
        </div>

        <div className="fv-card plan-card">
          <h2 className="card-title">Behavior-change plan</h2>
          <p className="notice-banner">
            Not medical advice — general wellness guidance only. Consult your clinician for personal care.
          </p>
          <ul className="plan-list">
            {plan.map((action, i) => (
              <li key={i} className="plan-item">
                <span className="plan-category">{action.category}</span>
                <strong>{action.title}</strong>
                <p>{action.detail}</p>
              </li>
            ))}
          </ul>
          <Button arrow to="/dashboard">
            Save & go to Track
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
