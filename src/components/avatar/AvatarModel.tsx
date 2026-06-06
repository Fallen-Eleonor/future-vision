import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, type Material, type Object3D, type ShaderMaterial } from 'three'

import { AVATAR_GLB_URL, AVATAR_MODEL_ROTATION, AVATAR_MODEL_URLS, type AvatarScenario } from '../../data/assets'
import { createHologramMaterial, updateHologramMaterial } from './HologramMaterial'

function isStandardLike(material: Material): material is MeshStandardMaterial | MeshPhysicalMaterial {
  return material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial
}

function applyRealisticLook(root: Object3D, future: boolean, variant: AvatarScenario) {
  // Distinct scenario GLBs are authored as-is — skip color grading
  if (variant === 'current' || variant === 'best' || variant === 'worst') {
    return
  }

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
    materials.forEach((material) => {
      if (!isStandardLike(material)) return

      if (!material.userData.baseColor) {
        material.userData.baseColor = material.color.clone()
        material.userData.baseRoughness = material.roughness
        material.userData.baseMetalness = material.metalness
      }

      const baseColor = material.userData.baseColor as Color
      const baseRoughness = material.userData.baseRoughness as number
      const baseMetalness = material.userData.baseMetalness as number

      if (variant === 'best') {
        material.color.copy(baseColor).lerp(new Color('#8eb5a8'), 0.06)
        material.roughness = Math.max(0, baseRoughness - 0.03)
        material.metalness = baseMetalness * 0.96
      } else if (variant === 'worst') {
        material.color.copy(baseColor).lerp(new Color('#8a8278'), 0.08)
        material.roughness = Math.min(1, baseRoughness + 0.06)
        material.metalness = baseMetalness * 0.88
      } else if (future) {
        material.color.copy(baseColor).lerp(new Color('#9a8f82'), 0.32)
        material.roughness = Math.min(1, baseRoughness + 0.18)
        material.metalness = baseMetalness * 0.45
      } else {
        material.color.copy(baseColor)
        material.roughness = baseRoughness
        material.metalness = baseMetalness
      }
    })
  })
}

function cloneScene(source: Object3D) {
  const clone = source.clone(true)
  clone.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((m) => m.clone())
    } else {
      obj.material = obj.material.clone()
    }
    obj.userData.savedMaterial = obj.material
  })
  return clone
}

function setHologramMaterials(root: Object3D, vitality: number, store: ShaderMaterial[]) {
  store.length = 0
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const holo = createHologramMaterial(vitality)
    store.push(holo)
    obj.material = holo
  })
}

function restoreSavedMaterials(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    if (obj.userData.savedMaterial) {
      obj.material = obj.userData.savedMaterial
    }
  })
}

type Props = {
  future: boolean
  hologram: boolean
  vitality: number
  modelUrl?: string
  variant?: AvatarScenario
  onReady?: () => void
}

export function AvatarModel({
  future,
  hologram,
  vitality,
  modelUrl = AVATAR_GLB_URL,
  variant = 'current',
  onReady,
}: Props) {
  const { scene } = useGLTF(modelUrl)
  const model = useMemo(() => cloneScene(scene), [scene])
  const hologramMaterials = useRef<ShaderMaterial[]>([])
  const readySent = useRef(false)

  useEffect(() => {
    if (hologram) {
      setHologramMaterials(model, vitality, hologramMaterials.current)
    } else {
      restoreSavedMaterials(model)
      applyRealisticLook(model, future, variant)
    }

    if (!readySent.current) {
      readySent.current = true
      onReady?.()
    }
  }, [model, future, hologram, vitality, variant, onReady])

  useFrame(({ clock }) => {
    if (!hologram) return
    hologramMaterials.current.forEach((mat) => {
      updateHologramMaterial(mat, vitality, clock.elapsedTime)
    })
  })

  return (
    <Center top>
      <primitive
        object={model}
        scale={1.75}
        position={[0, -1.15, 0]}
        rotation={AVATAR_MODEL_ROTATION}
      />
    </Center>
  )
}

export function preloadAvatarModels(urls: string[]) {
  urls.forEach((url) => useGLTF.preload(url))
}

useGLTF.preload(AVATAR_GLB_URL)
;[...new Set(Object.values(AVATAR_MODEL_URLS))].forEach((url) => useGLTF.preload(url))
