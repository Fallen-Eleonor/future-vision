export const HERO_ORB_URL =
  'https://image.mux.com/wyA5PUwZhcun2X1VScU1EecG5tbQfVPJW3a9YUSKUv4/animated.webp?width=640&fps=15'

/** Demo hero persona — pre-rendered path for stage reliability */
export const AVATAR_NOW_URL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&auto=format&fit=crop&q=80'

/** Primary 3D avatar (GLB) — current / default */
export const AVATAR_GLB_URL = '/models/avatar-current.glb'

/** Y-axis rotation so GLB faces the camera on Reveal / Plan */
export const AVATAR_MODEL_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0]

export type AvatarScenario = 'current' | 'best' | 'worst'

/**
 *   current → avatar (1).glb
 *   best    → avatar_superold.glb
 *   worst   → avatar_old.glb
 */
export const AVATAR_MODEL_URLS: Record<AvatarScenario, string> = {
  current: '/models/avatar-current.glb',
  best: '/models/avatar-superold.glb',
  worst: '/models/avatar-old.glb',
}

export const AVATAR_PLUS10_URL =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&auto=format&fit=crop&q=80&sat=-40&blur=0'
