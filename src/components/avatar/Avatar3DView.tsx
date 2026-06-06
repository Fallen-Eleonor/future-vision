import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { isWebGLAvailable } from '../../lib/webgl'
import type { AvatarScenario } from '../../data/assets'

const AvatarCanvas = lazy(() => import('./AvatarCanvas'))

type Props = {
  future: boolean
  hologram?: boolean
  vitality?: number
  fallbackSrc: string
  modelUrl?: string
  variant?: AvatarScenario
  compact?: boolean
}

type ErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type ErrorBoundaryState = {
  failed: boolean
}

class AvatarErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function AvatarFallbackImage({ src, future }: { src: string; future: boolean }) {
  return (
    <img
      src={src}
      alt=""
      className={`reveal-avatar-img ${future ? 'reveal-avatar-img--future' : ''}`}
    />
  )
}

function AvatarLoading({ src, progress }: { src: string; progress: number }) {
  return (
    <div className="reveal-avatar-loading" aria-hidden="true">
      <img src={src} alt="" className="reveal-avatar-loading-img" />
      <div className="reveal-avatar-loading-bar">
        <span className="reveal-avatar-loading-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="reveal-avatar-loading-label">
        Loading 3D avatar… {Math.round(progress)}%
      </span>
    </div>
  )
}

function AvatarCanvasHost({
  future,
  hologram,
  vitality,
  fallbackSrc,
  modelUrl,
  variant,
  compact = false,
}: Required<Pick<Props, 'future' | 'hologram' | 'vitality' | 'fallbackSrc'>> &
  Pick<Props, 'modelUrl' | 'variant' | 'compact'>) {
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  return (
    <>
      {!ready && <AvatarLoading src={fallbackSrc} progress={ready ? 100 : 35} />}
      <AvatarCanvas
        future={future}
        hologram={hologram}
        vitality={vitality}
        modelUrl={modelUrl}
        variant={variant}
        compact={compact}
        onReady={onReady}
      />
    </>
  )
}

export function Avatar3DView({
  future,
  hologram = false,
  vitality = 70,
  fallbackSrc,
  modelUrl,
  variant = 'current',
  compact = false,
}: Props) {
  const [canUse3d, setCanUse3d] = useState(false)

  useEffect(() => {
    setCanUse3d(isWebGLAvailable())
  }, [])

  const fallback = <AvatarFallbackImage src={fallbackSrc} future={future} />
  const showHologram = hologram === true || (future && hologram !== false)

  if (!canUse3d) return fallback

  return (
    <AvatarErrorBoundary fallback={fallback}>
      <div
        className={`reveal-avatar-canvas ${showHologram ? 'reveal-avatar-canvas--hologram' : ''} ${future ? 'reveal-avatar-canvas--future' : ''} ${compact ? 'reveal-avatar-canvas--compact' : ''}`}
      >
        <Suspense fallback={<AvatarLoading src={fallbackSrc} progress={0} />}>
          <AvatarCanvasHost
            future={future}
            hologram={showHologram}
            vitality={vitality}
            fallbackSrc={fallbackSrc}
            modelUrl={modelUrl}
            variant={variant}
            compact={compact}
          />
        </Suspense>
      </div>
    </AvatarErrorBoundary>
  )
}
