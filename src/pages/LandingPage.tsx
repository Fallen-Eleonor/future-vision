import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import '../styles/landing.css'

const VIDEO_SRC = '/foresight-head-motion.mp4'
const PREVIEW_IMG = '/foresight-anatomy-preview.png'
const FADE_IN_MS = 1100

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function FadingVideo(props: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let animationFrame = 0
    let startedAt = 0
    let hasStarted = false

    const fadeIn = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp
      const linear = clamp((timestamp - startedAt) / FADE_IN_MS, 0, 1)
      const progress = easeOutCubic(linear)
      video.style.opacity = String(progress)
      if (linear < 1) {
        animationFrame = requestAnimationFrame(fadeIn)
      }
    }

    const startPlayback = () => {
      if (hasStarted) return
      hasStarted = true
      video.style.opacity = '0'
      startedAt = 0
      cancelAnimationFrame(animationFrame)
      void video.play().catch(() => {})
      animationFrame = requestAnimationFrame(fadeIn)
    }

    const handleError = () => {
      video.style.opacity = '1'
    }

    const fallbackTimer = window.setTimeout(() => {
      if (video.style.opacity === '0' || video.style.opacity === '') {
        video.style.opacity = '1'
        void video.play().catch(() => {})
      }
    }, 2500)

    video.addEventListener('loadeddata', startPlayback)
    video.addEventListener('canplay', startPlayback)
    video.addEventListener('error', handleError)
    if (video.readyState >= 2) startPlayback()

    return () => {
      video.removeEventListener('loadeddata', startPlayback)
      video.removeEventListener('canplay', startPlayback)
      video.removeEventListener('error', handleError)
      window.clearTimeout(fallbackTimer)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <video {...props} ref={videoRef} style={{ opacity: 0, ...props.style }} />
}

const steps = [
  {
    icon: Activity,
    label: 'Risk',
    title: 'Get a score that means something.',
    body: 'Answer a few human questions. Future Vision translates validated diabetes-risk science into a clear starting point, without fear or medical jargon.',
  },
  {
    icon: UserRound,
    label: 'Reveal',
    title: "Meet the path you're on.",
    body: 'See a future-self preview that shows vitality, energy, and momentum over time. Not body size. Not shame. Just a more tangible way to care.',
  },
  {
    icon: CalendarCheck,
    label: 'Plan',
    title: 'Turn the reveal into next steps.',
    body: 'Leave with a focused 7-day plan built around movement, meals, sleep, and daily habits that feel realistic enough to actually start.',
  },
]

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="wordmark" to="/" aria-label="Future Vision home">
        Future Vision
      </Link>
      <div className="nav-links liquid-glass" aria-label="Primary">
        <a href="#how">How it works</a>
        <a href="#science">Science</a>
        <a href="#preview">Preview</a>
      </div>
    </nav>
  )
}

function EvidenceBadge() {
  return (
    <div className="hero-badge liquid-glass">
      <Sparkles size={16} strokeWidth={1.7} aria-hidden="true" />
      <span>Future-self visualization</span>
    </div>
  )
}

function CornerAction({ onTry }: { onTry: () => void }) {
  return (
    <button type="button" className="corner-action" onClick={onTry} aria-label="Start the reveal">
      <span className="corner-mask corner-mask-top" aria-hidden="true" />
      <span className="corner-mask corner-mask-left" aria-hidden="true" />
      <span className="corner-icon liquid-glass">
        <ArrowUpRight size={24} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="corner-copy">
        <strong>Start the reveal</strong>
        <span>
          See your score <ChevronRight size={15} strokeWidth={1.7} aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

function Hero({ onTry }: { onTry: () => void }) {
  return (
    <section className="hero-frame" aria-labelledby="hero-title">
      <FadingVideo
        className="hero-video"
        src={VIDEO_SRC}
        poster={PREVIEW_IMG}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="An anatomy-style future-self portrait in motion"
      />
      <div className="hero-scrim" aria-hidden="true" />
      <Navbar />
      <div className="hero-content">
        <EvidenceBadge />
        <h1 id="hero-title">Meet your future self.</h1>
        <p>See what today&apos;s habits are doing to you, and change it while it still matters.</p>
        <div className="hero-actions" id="try">
          <button type="button" className="primary-button liquid-glass-strong" onClick={onTry}>
            See my future
            <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <span>Grounded in validated diabetes-risk science.</span>
        </div>
      </div>
      <CornerAction onTry={onTry} />
    </section>
  )
}

function ScorePreview() {
  return (
    <aside className="score-preview liquid-glass" id="preview" aria-label="Future Vision preview">
      <div className="preview-tabs liquid-glass">
        <span>Now</span>
        <span>+10 years</span>
      </div>
      <div className="future-window">
        <div className="future-profile liquid-glass">
          <img
            src={PREVIEW_IMG}
            alt="An anatomy-style future-self figure with a soft double exposure"
          />
        </div>
        <div className="future-copy liquid-glass">
          <span>Wellness Score</span>
          <strong>72</strong>
          <small>Building healthy momentum</small>
        </div>
      </div>
      <div className="risk-meter liquid-glass">
        <div>
          <span>Type-2 diabetes risk</span>
          <strong>12%</strong>
        </div>
        <p>Moderate today. Changeable tomorrow.</p>
        <div className="meter-track" aria-hidden="true">
          <span />
        </div>
        <small>Based on validated risk research.</small>
      </div>
    </aside>
  )
}

function HowItWorks({ onTry }: { onTry: () => void }) {
  return (
    <section className="how-section" id="how" aria-labelledby="how-title">
      <div className="how-copy">
        <div className="section-chip liquid-glass">
          <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
          <span>Evidence-backed. Human-first.</span>
        </div>
        <h2 id="how-title">The future you can still change.</h2>
        <p>
          Future Vision turns a validated type-2 diabetes risk score into something you can feel,
          understand, and act on today.
        </p>
        <div className="how-actions">
          <button type="button" className="primary-button liquid-glass-strong" onClick={onTry}>
            See my future
            <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <a className="secondary-button liquid-glass" href="#science">
            How scoring works
          </a>
        </div>
      </div>
      <ScorePreview />
      <div className="step-grid" id="science">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <article className="step-card liquid-glass" key={step.label}>
              <div className="step-icon">
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
              </div>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <ArrowUpRight className="step-arrow" size={20} strokeWidth={1.7} aria-hidden="true" />
            </article>
          )
        })}
      </div>
      <div className="proof-row">
        <span>Built on science</span>
        <span>FINDRISC-informed risk logic</span>
        <span>Privacy first</span>
        <span>Not medical advice</span>
      </div>
    </section>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const startOnboarding = () => navigate('/onboarding')

  React.useEffect(() => {
    document.body.classList.add('is-landing')
    return () => document.body.classList.remove('is-landing')
  }, [])

  return (
    <div className="landing-page">
      <main className="landing-page-shell">
        <Hero onTry={startOnboarding} />
        <HowItWorks onTry={startOnboarding} />
      </main>
    </div>
  )
}
