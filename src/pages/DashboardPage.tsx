import { useRef, useState, useEffect } from 'react' // 1. Added useState and useEffect
import { Link, Navigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { AppleHealthChart } from '../components/AppleHealthChart'
import { AppleWatchChart } from '../components/AppleWatchChart'
import { CgmChart } from '../components/CgmChart'
import { GoalToggle } from '../components/GoalToggle'
import { LiverStreak } from '../components/LiverStreak'
import { useApp } from '../context/AppContext'

const mockMeals = [
  {
    label: 'Grilled chicken salad',
    glycemicImpact: 'low' as const,
    macros: { carbs: 18, protein: 32, fat: 12 },
    swap: 'Already a strong choice — add chickpeas for fiber',
  },
  {
    label: 'White rice bowl',
    glycemicImpact: 'high' as const,
    macros: { carbs: 58, protein: 8, fat: 6 },
    swap: 'Try half rice, half cauliflower rice next time',
  },
  {
    label: 'Oatmeal with berries',
    glycemicImpact: 'medium' as const,
    macros: { carbs: 42, protein: 10, fat: 5 },
    swap: 'Add a handful of nuts to slow glucose absorption',
  },
]

export function DashboardPage() {
  const { state, risk, wellness, toggleGoal, addMeal, toggleDevice, reset } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [calories] = useState({
    calories:600,
    glycemicImpact:'low'
  })
  // 2. State to hold the temporary preview URL string
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 3. Clean up the object URL to avoid memory leaks when the component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  if (!state.profile || !risk || !wellness) {
    return <Navigate to="/onboarding" replace />
  }

  // 4. Updated handler to catch the file and generate a preview
  const handleMealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a local URL for the file to show as preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    const mock = mockMeals[Math.floor(Math.random() * mockMeals.length)]
    addMeal({
      date: new Date().toLocaleDateString(),
      ...mock,
      // If your context supports saving the image file or URL, you can pass it here:
      // image: previewUrl 
    })
  }

  return (
    <AppShell pageAction={{ label: 'View reveal', to: '/reveal' }}>
      <p className="page-breadcrumb">Track · Goals, meals & streak</p>
      <header className="dashboard-header">
        <div>
          <h1 className="page-title page-title--sm">Hi, {state.profile.name}</h1>
          <p className="page-subtitle">Your daily adherence hub</p>
        </div>
        <div className="metric-pills">
          <div className="metric-pill">
            <span>Wellness</span>
            <strong>{wellness.score}</strong>
          </div>
          <div className="metric-pill">
            <span>T2D risk</span>
            <strong>{risk.riskPercent}%</strong>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="fv-card">
          <h2 className="card-title">Health goals</h2>
          <ul className="goal-list">
            {state.goals.map((g) => (
              <li key={g.id}>
                <GoalToggle title={g.title} done={g.done} onToggle={() => toggleGoal(g.id)} />
              </li>
            ))}
          </ul>
          <Link to="/optimizer" className="btn-text">
            Edit action plan →
          </Link>
        </section>

        <section className="fv-card">
          <h2 className="card-title">Meal log</h2>
          <p className="hint">Photo → directional glycemic estimate (demo)</p>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleMealUpload} />
          
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            + Add meal photo
          </Button>
          {
            imagePreview && (
            <>
            <h4> calories: {calories.calories} </h4>
            <h4>    glycemicImpact:{calories.glycemicImpact}</h4>
            <h4>Date: {new Date().toLocaleDateString()}</h4>
            </>)
          }
            
          {/* 5. Render the preview UI if an image exists */}
          {imagePreview && (
            <div className="meal-preview-container" style={{ marginTop: '1rem', position: 'relative' }}>
              <p className="hint">Uploaded Image Preview:</p>
              <img 
                src={imagePreview} 
                alt="Meal preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <button 
                type="button" 
                className="btn-text btn-text--muted"
                style={{ fontSize: '12px', marginTop: '4px' }}
                onClick={() => setImagePreview(null)}
              >
                Clear Photo
              </button>
            </div>
          )}

          <ul className="meal-list">
            {state.meals.map((m) => (
              <li key={m.id} className={`meal-item meal-item--${m.glycemicImpact}`}>
                <div className="meal-top">
                  <strong>{m.label}</strong>
                  <span>{m.glycemicImpact} impact</span>
                </div>
                <p>
                  C{m.macros.carbs}g · P{m.macros.protein}g · F{m.macros.fat}g
                </p>
                <p className="meal-swap">Swap: {m.swap}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="fv-card">
          <h2 className="card-title">Devices</h2>
          <p className="hint">Mock connections for demo</p>
          <div className="device-list">
            {(
              [
                ['appleHealth', 'Apple Health'],
                ['watch', 'Apple Watch'],
                ['cgm', 'CGM'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`device-btn ${state.devicesConnected[key] ? 'connected' : ''}`}
                onClick={() => toggleDevice(key)}
              >
                {label}
                <span>{state.devicesConnected[key] ? 'Connected' : 'Connect'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="fv-card fv-card--device">
          <AppleHealthChart connected={state.devicesConnected.appleHealth} compact />
        </section>

        <section className="fv-card fv-card--device">
          <AppleWatchChart connected={state.devicesConnected.watch} compact />
        </section>

        <section className="fv-card fv-card--device">
          <CgmChart connected={state.devicesConnected.cgm} compact />
        </section>

        <section className="fv-card fv-card--full">
          <LiverStreak days={state.streakDays} />
        </section>
      </div>

      <div className="dashboard-actions">
        <button 
          type="button" 
          className="btn-text btn-text--muted" 
          onClick={() => {
            reset();
            setImagePreview(null); // Clear preview on reset
          }}
        >
          Reset demo & start over
        </button>
      </div>
    </AppShell>
  )
}