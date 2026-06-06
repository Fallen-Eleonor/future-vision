import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { OnboardingSidebar, ONBOARDING_STEPS } from '../components/OnboardingSidebar'
import { useApp } from '../context/AppContext'
import { computeBmi } from '../lib/findrisc'
import { preloadAvatarModel } from '../lib/preloadAvatar'
import type { ActivityLevel, DietPattern, Frequency, Profile } from '../types'

const STEP_LABELS = ['Introduction', 'Profile', 'Body metrics', 'Lifestyle baseline', 'Risk screening', 'Optional extras']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { draftProfile, setDraftProfile, acceptDisclaimer, completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const total = ONBOARDING_STEPS.length
  const progress = ((step + 1) / total) * 100

  useEffect(() => {
    preloadAvatarModel()
  }, [])

  const next = () => {
    if (step === 0) acceptDisclaimer()
    if (step === total - 1) {
      completeOnboarding()
      navigate('/reveal')
      return
    }
    setStep((s) => s + 1)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const canContinue = () => {
    if (step === 1) return draftProfile.name.trim().length >= 2
    if (step === 2) return draftProfile.heightCm > 0 && draftProfile.weightKg > 0
    return true
  }

  const bmi = computeBmi(draftProfile.weightKg, draftProfile.heightCm)

  return (
    <AppShell showFooter={false}>
      <div className="onboarding-shell onboarding-shell--unified">
        <OnboardingSidebar
          currentStep={step}
          onStepClick={(i) => {
            if (i < step) setStep(i)
          }}
        />

        <main className="onboarding-main">
          <header className="onboarding-main-header">
            <div className="onboarding-progress-meta">
              <span className="onboarding-progress-kicker">SETUP · {STEP_LABELS[step].toUpperCase()}</span>
              <span className="onboarding-progress-count">
                Step {step + 1} of {total}
              </span>
            </div>
            <div
              className="onboarding-progress-bar"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={total}
            >
              <div className="onboarding-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </header>

          <div className="fv-card onboarding-card">
            <h1 className="page-title">{headlineForStep(step)}</h1>
            {subtitleForStep(step) && <p className="page-subtitle">{subtitleForStep(step)}</p>}

            {step === 0 && (
              <div className="onboarding-card-body">
                <p>
                  Future Vision is an educational wellness experience — not a medical device and not a
                  diagnosis. Your data stays in this browser session for the demo.
                </p>
                <ul className="check-list">
                  <li>Validated FINDRISC screening (computed locally)</li>
                  <li>Vitality-anchored visuals, not body-shame imagery</li>
                  <li>No calorie targets or restrictive prescriptions</li>
                </ul>
              </div>
            )}

            {step === 1 && (
              <div className="onboarding-card-body">
                <label className="field">
                  Your first name
                  <input
                    value={draftProfile.name}
                    onChange={(e) => setDraftProfile({ name: e.target.value })}
                    placeholder="Adam"
                    autoFocus
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-card-body form-grid">
                <label className="field">
                  Height (cm)
                  <input
                    type="number"
                    value={draftProfile.heightCm}
                    onChange={(e) => setDraftProfile({ heightCm: Number(e.target.value) })}
                  />
                </label>
                <label className="field">
                  Weight (kg)
                  <input
                    type="number"
                    value={draftProfile.weightKg}
                    onChange={(e) => setDraftProfile({ weightKg: Number(e.target.value) })}
                  />
                </label>
                <label className="field full">
                  Waist circumference (cm, optional)
                  <input
                    type="number"
                    value={draftProfile.waistCm ?? ''}
                    onChange={(e) =>
                      setDraftProfile({ waistCm: e.target.value ? Number(e.target.value) : undefined })
                    }
                    placeholder="Optional — improves FINDRISC accuracy"
                  />
                </label>
                <p className="hint full">Computed BMI: {bmi} (never asked directly)</p>
              </div>
            )}

            {step === 3 && (
              <div className="onboarding-card-body">
                <p className="section-kicker">Daily activity</p>
                <div className="activity-grid">
                  {activityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`activity-card ${draftProfile.activity === opt.value ? 'selected' : ''}`}
                      onClick={() => setDraftProfile({ activity: opt.value })}
                    >
                      <span className="activity-card-icon">{opt.icon}</span>
                      <span className="activity-card-title">{opt.label}</span>
                      <span className="activity-card-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="section-kicker">Diet & habits</p>
                <div className="form-grid">
                  <SelectField
                    label="Diet pattern"
                    value={draftProfile.dietPattern}
                    onChange={(v) => setDraftProfile({ dietPattern: v as DietPattern })}
                    options={[
                      ['omnivore', 'Omnivore'],
                      ['vegetarian', 'Vegetarian'],
                      ['vegan', 'Vegan'],
                    ]}
                  />
                  <SelectField
                    label="Sugary drinks"
                    value={draftProfile.sugaryDrinks}
                    onChange={(v) => setDraftProfile({ sugaryDrinks: v as Frequency })}
                    options={[
                      ['never', 'Never'],
                      ['sometimes', 'Sometimes'],
                      ['often', 'Often'],
                      ['daily', 'Daily'],
                    ]}
                  />
                  <SelectField
                    label="Junk / ultra-processed food"
                    value={draftProfile.junkFood}
                    onChange={(v) => setDraftProfile({ junkFood: v as Frequency })}
                    options={[
                      ['never', 'Rarely'],
                      ['sometimes', 'Sometimes'],
                      ['often', 'Often'],
                      ['daily', 'Daily'],
                    ]}
                  />
                  <SelectField
                    label="Fruit & vegetables"
                    value={draftProfile.fruitVegDaily ? 'yes' : 'no'}
                    onChange={(v) => setDraftProfile({ fruitVegDaily: v === 'yes' })}
                    options={[
                      ['yes', 'Daily'],
                      ['no', 'Not daily'],
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="onboarding-card-body form-grid">
                <SelectField
                  label="Age band"
                  value={draftProfile.ageBand}
                  onChange={(v) => setDraftProfile({ ageBand: v as Profile['ageBand'] })}
                  options={[
                    ['<45', 'Under 45'],
                    ['45-54', '45–54'],
                    ['55-64', '55–64'],
                    ['65+', '65+'],
                  ]}
                />
                <SelectField
                  label="Family history of diabetes"
                  value={draftProfile.familyHistory}
                  onChange={(v) => setDraftProfile({ familyHistory: v as Profile['familyHistory'] })}
                  options={[
                    ['none', 'None'],
                    ['second_degree', 'Grandparent, aunt, uncle'],
                    ['first_degree', 'Parent, sibling, or child'],
                  ]}
                />
                <SelectField
                  label="Blood pressure medication"
                  value={draftProfile.bpMedication ? 'yes' : 'no'}
                  onChange={(v) => setDraftProfile({ bpMedication: v === 'yes' })}
                  options={[
                    ['no', 'No'],
                    ['yes', 'Yes'],
                  ]}
                />
                <SelectField
                  label="High blood glucose history"
                  value={draftProfile.highBloodGlucose ? 'yes' : 'no'}
                  onChange={(v) => setDraftProfile({ highBloodGlucose: v === 'yes' })}
                  options={[
                    ['no', 'No'],
                    ['yes', 'Yes (screening or diagnosis)'],
                  ]}
                />
              </div>
            )}

            {step === 5 && (
              <div className="onboarding-card-body form-grid">
                <div className="file-field full">
                  <span className="file-field-label">Portrait photo (optional)</span>
                  <label className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-upload-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setDraftProfile({ portraitUrl: URL.createObjectURL(file) })
                      }}
                    />
                    <span className="file-upload-button btn-teal btn-sm">
                      {draftProfile.portraitUrl ? 'Change photo' : 'Choose photo'}
                    </span>
                    <span className="file-upload-hint">JPG, PNG · demo only</span>
                  </label>
                </div>
                {draftProfile.portraitUrl && (
                  <img src={draftProfile.portraitUrl} alt="Portrait preview" className="portrait-preview" />
                )}
                <label className="field full">
                  Insurance provider (optional)
                  <input
                    value={draftProfile.insurance ?? ''}
                    onChange={(e) => setDraftProfile({ insurance: e.target.value || undefined })}
                    placeholder="e.g. Aetna, United — never a gate"
                  />
                </label>
              </div>
            )}

            <footer className="card-footer">
              {step > 0 ? (
                <button type="button" className="btn-text" onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button type="button" className="btn-teal" disabled={!canContinue()} onClick={next}>
                {step === total - 1 ? 'Go to Reveal →' : 'Continue →'}
              </button>
            </footer>
          </div>

          <p className="onboarding-privacy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.5" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeWidth="1.5" />
            </svg>
            Your health data stays in this browser session for the demo
          </p>
        </main>
      </div>
    </AppShell>
  )
}

const activityOptions: {
  value: ActivityLevel
  label: string
  desc: string
  icon: string
}[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, minimal movement', icon: '🪑' },
  { value: 'lightly_active', label: 'Light', desc: 'Short walks, some movement', icon: '🚶' },
  { value: 'active', label: 'Active', desc: 'On your feet most of the day', icon: '⚡' },
  { value: 'regular_gym', label: 'Very active', desc: 'Regular exercise or sport', icon: '🏃' },
]

function headlineForStep(step: number): string {
  const headlines = [
    'Welcome to your future-self journey',
    'What should we call you?',
    'Tell us about your body',
    'How active is your daily life?',
    'A few validated risk questions',
    'Anything else to personalize?',
  ]
  return headlines[step] ?? ONBOARDING_STEPS[step].title
}

function subtitleForStep(step: number): string | null {
  const subs = [
    'Screening-level wellness — not a diagnosis.',
    'We use your first name to personalize your reveal.',
    'BMI is computed automatically — we never ask directly.',
    'Activity and diet shape your FINDRISC trajectory.',
    'FINDRISC items — deterministic, no AI in the math.',
    'Photo and insurance are optional and never block you.',
  ]
  return subs[step] ?? null
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <label className="field">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
