import { MeshStandardMaterial } from 'three'

export const primary = new MeshStandardMaterial({
  name: 'primary',
  color: 'whitesmoke',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5
})

export const secondary = new MeshStandardMaterial({
  name: 'secondary',
  color: 'sienna',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5
})

export const highlight = new MeshStandardMaterial({
  name: 'highlight',
  color: 'red',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5
})
