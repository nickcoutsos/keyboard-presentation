import { throttle } from 'lodash'
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'

const container = document.querySelector('#app')

export const renderer = new WebGLRenderer({ antialias: true, alpha: true });
export const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
export const scene = new Scene()
export const renderFrame = throttle(() => renderer.render(scene, camera), 16)

export const init = () => {
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', resize)

  const ambientLight = new AmbientLight('powderblue', .8)
  const directionalLight = new DirectionalLight('white', 1)
  directionalLight.position.set(0, 5, 5)

  camera.position.set(-5, -10, 10)
  camera.up.set(0, 0, 1)
  camera.lookAt(new Vector3(0, 0, 0))

  scene.add(
    camera,
    directionalLight,
    ambientLight
  )

  resize()
}

function resize () {
  const { width, height } = container.getBoundingClientRect()

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderFrame()
}
