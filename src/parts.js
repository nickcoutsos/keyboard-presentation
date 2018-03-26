import { Color, Mesh, Object3D, Plane, Vector3 } from 'three'
import * as materials from './materials'
import STLLoader from './stl-loader'
import * as viewer from './viewer'
import * as animation from './animation'

const scene = new Object3D()
const loader = new STLLoader()
const addMesh = geometry => scene.add(new Mesh(geometry, materials.primary))

loader.load('dist/assets/plates.stl', addMesh)
loader.load('dist/assets/main-supports.stl', geometry => {
  const material = materials.primary.clone()
  const normal = new Vector3(0, 1, 0)
  const start = new Vector3(0, 5, 0)
  const end = new Vector3(0, -5, 0)
  const plane = new Plane().setFromNormalAndCoplanarPoint(normal, start)

  material.clippingPlanes = [plane]
  material.color = new Color('antiquewhite')
  scene.add(new Mesh(geometry, material))

  viewer.renderFrame()
  animation.animate(t => {
    plane.setFromNormalAndCoplanarPoint(normal, start.clone().lerp(end, t))
    viewer.renderFrame()
  }, 2000).start()
})

loader.load('dist/assets/cross-supports.stl', geometry => {
  const material = materials.primary.clone()
  const normal = new Vector3(1, 0, 0)
  const start = new Vector3(12, 0, 0)
  const end = new Vector3(-12, 0, 0)
  const plane = new Plane().setFromNormalAndCoplanarPoint(normal, start)

  material.clippingPlanes = [plane]
  material.color = new Color('honeydew')
  scene.add(new Mesh(geometry, material))

  viewer.renderFrame()
  const reveal = animation.animate(t => {
    plane.setFromNormalAndCoplanarPoint(normal, start.clone().lerp(end, t))
    viewer.renderFrame()
  }, 2000)

  setTimeout(reveal.start, 3000)
})

export { scene }
