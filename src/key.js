import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export default (w, h, primary) => {
  const x = w - .15
  const y = h - .15

  const key = new Mesh(
    new BoxGeometry(1, 1, .35),
    new MeshStandardMaterial({
      color: primary ? 'whitesmoke' : 'sienna',
      emissive: 'white',
      emissiveIntensity: 0.1,
      roughness: 0.7,
      metalness: 0.5
    })
  )

  key.scale.x = x
  key.scale.y = y
  key.updateMatrix()

  return key
}
