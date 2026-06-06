import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

const HologramMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#0d9488'),
    uVitality: 0.7,
    uOpacity: 0.68,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uVitality;
    uniform float uOpacity;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.8);
      float scan = sin((gl_FragCoord.y + uTime * 55.0) * 0.1) * 0.5 + 0.5;
      float pulse = 0.88 + 0.12 * sin(uTime * 2.2);
      float alpha = uOpacity * (0.22 + fresnel * 0.78);
      alpha *= 0.82 + scan * 0.18;
      vec3 core = uColor * (0.35 + uVitality * 0.65) * pulse;
      vec3 rim = vec3(0.45, 0.95, 0.88) * fresnel * 1.35;
      vec3 col = core + rim;
      gl_FragColor = vec4(col, alpha);
    }
  `,
)

extend({ HologramMaterialImpl })

declare module '@react-three/fiber' {
  interface ThreeElements {
    hologramMaterialImpl: ThreeElement<typeof HologramMaterialImpl>
  }
}

export function createHologramMaterial(vitality: number) {
  const mat = new HologramMaterialImpl()
  mat.transparent = true
  mat.depthWrite = false
  mat.side = THREE.DoubleSide
  mat.blending = THREE.AdditiveBlending
  mat.uniforms.uVitality.value = Math.min(1, Math.max(0, vitality / 100))
  return mat
}

export function updateHologramMaterial(
  material: THREE.ShaderMaterial,
  vitality: number,
  time: number,
) {
  material.uniforms.uTime.value = time
  material.uniforms.uVitality.value = Math.min(1, Math.max(0, vitality / 100))
}
