import { DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import * as layouts from './layouts'
import './style.css'

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
const scene = new Scene()

function resize () {
  const element = document.querySelector('#app')
  const { width, height } = element.getBoundingClientRect()

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

// function animate() {
//   requestAnimationFrame(animate)
//   renderer.render(scene, camera)
// }

const light = new DirectionalLight('white', 1)
light.position.set(0, 5, 5)

camera.position.set(-5, -10, 10)
camera.up.set(0, 0, 1)
camera.lookAt(new Vector3(0, 0, 0))

scene.add(camera, light, layouts.makeKeyboard(layouts.apple))

document.querySelector('#app').appendChild(renderer.domElement)
window.addEventListener('resize', resize)

resize()
// animate()
