import { AVATAR_GLB_URL, AVATAR_MODEL_URLS } from '../data/assets'

export function preloadAvatarModel() {
  const urls = [...new Set([AVATAR_GLB_URL, ...Object.values(AVATAR_MODEL_URLS)])]
  void import('@react-three/drei').then(({ useGLTF }) => {
    urls.forEach((url) => useGLTF.preload(url))
  })
}
