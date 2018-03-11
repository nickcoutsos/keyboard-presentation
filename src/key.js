import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export default (w, h, primary) => (
   new Mesh(
    new BoxGeometry(w - .15, h - .15, .15),
    new MeshStandardMaterial({
      color: primary ? 'whitesmoke' : 'sienna',
      emissive: 'white',
      emissiveIntensity: 0.1,
      roughness: 0.7,
      metalness: 0.5
    })
  )
)
