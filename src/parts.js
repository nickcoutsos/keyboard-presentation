import { Mesh, Object3D } from 'three'
import * as materials from './materials'
import STLLoader from './stl-loader'

const scene = new Object3D()
const loader = new STLLoader()
const addMesh = name => geometry => scene.add(
  Object.assign(new Mesh(geometry, materials.primary), { name })
)

const parts = {
  caps: 'dist/assets/caps.stl',
  plates: 'dist/assets/plates.stl',
  mainSupports: 'dist/assets/main-supports.stl',
  crossSupports: 'dist/assets/cross-supports.stl'
}

const loadAll = () => Promise.all(
  Object.keys(parts).map(name => (
    loader.load(parts[name], addMesh(name))
  ))
)


export { scene, loadAll }
