import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { AvatarModel } from './AvatarModel'
import type { AvatarScenario } from '../../data/assets'

type Props = {
  future: boolean
  hologram: boolean
  vitality: number
  modelUrl?: string
  variant?: AvatarScenario
  onReady?: () => void
}

function Scene({ future, hologram, vitality, modelUrl, variant, onReady }: Props) {
  return (
    <>
      {!hologram && <color attach="background" args={[future ? '#d8d4ce' : '#ebeae8']} />}
      {hologram && <color attach="background" args={['#dfe8ea']} />}

      <ambientLight intensity={hologram ? 0.25 : future ? 0.42 : 0.62} />
      <hemisphereLight
        args={[
          hologram ? '#b8e8e4' : future ? '#c8ccd4' : '#ffffff',
          hologram ? '#1e293b' : future ? '#6b6560' : '#9ca3af',
          hologram ? 0.75 : 0.55,
        ]}
      />
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={hologram ? 0.45 : future ? 0.75 : 1.25}
        color={hologram ? '#5eead4' : future ? '#b8c0cc' : '#fff6ee'}
        castShadow={!hologram}
      />
      <directionalLight position={[-2.5, 2.5, -2]} intensity={hologram ? 0.2 : 0.35} color="#ffffff" />

      {!hologram && <Environment preset="studio" environmentIntensity={future ? 0.55 : 0.85} />}

      <Suspense fallback={null}>
        <Float speed={hologram ? 1.6 : 1.1} rotationIntensity={0} floatIntensity={hologram ? 0.35 : 0.18}>
          <AvatarModel
            future={future}
            hologram={hologram}
            vitality={vitality}
            modelUrl={modelUrl}
            variant={variant}
            onReady={onReady}
          />
        </Float>
      </Suspense>

      {hologram && (
        <Sparkles count={48} scale={[1.8, 2.4, 1.2]} size={2.2} speed={0.35} color="#5eead4" opacity={0.45} />
      )}

      {!hologram && (
        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={future ? 0.28 : 0.38}
          scale={9}
          blur={2.4}
          far={4}
          color="#1f2937"
        />
      )}

      <OrbitControls
        enablePan={false}
        minDistance={1.6}
        maxDistance={3.4}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.85}
        target={[0, 0.85, 0]}
        autoRotate={false}
      />

      {hologram && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={0.95} mipmapBlur />
        </EffectComposer>
      )}
    </>
  )
}

export default function AvatarCanvas({
  future,
  hologram,
  vitality,
  modelUrl,
  variant,
  onReady,
  compact = false,
}: Props & { compact?: boolean }) {
  return (
    <Canvas
      className="reveal-avatar-canvas-inner"
      shadows={!hologram}
      dpr={compact ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.95, 2.65], fov: 42, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <Scene
        future={future}
        hologram={hologram}
        vitality={vitality}
        modelUrl={modelUrl}
        variant={variant}
        onReady={onReady}
      />
    </Canvas>
  )
}
