import { AmbientLight, DirectionalLight, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import * as layouts from './layouts'
import * as dactyl from './dactyl'
import tween from './tween'
import './style.css'

const container = document.querySelector('#app')
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
const scene = new Scene()

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
container.appendChild(renderer.domElement)
window.addEventListener('resize', resize)

function renderFrame () {
  renderer.render(scene, camera)
}

function resize () {
  const { width, height } = container.getBoundingClientRect()

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderFrame()
}

const ambientLight = new AmbientLight('powderblue', .8)
const directionalLight = new DirectionalLight('white', 1)
directionalLight.position.set(0, 5, 5)

camera.position.set(-5, -10, 10)
camera.up.set(0, 0, 1)
camera.lookAt(new Vector3(0, 0, 0))

const wrapper = new Object3D()

const phases = [
  layouts.makeKeyboard(layouts.classic),
  layouts.makeKeyboard(layouts.apple),
  layouts.makeKeyboard(layouts.preonic),
  layouts.makeKeyboard(layouts.split),
  layouts.makeKeyboard(layouts.ergodox),
  dactyl.makeKeyboard()
]

const tweens = phases.reduce((acc, phase, i, phases) => {
  if (i === phases.length - 1) {
    return acc
  }

  const start = phase.clone()
  const end = phases[i + 1].clone()
  const animation = tween(renderFrame, start, end, 2000)
  return acc.concat(callback => {
    wrapper.remove(...wrapper.children)
    wrapper.add(start)
    wrapper.updateMatrix()
    renderFrame()
    setTimeout(() => animation(callback), 1000)
  })
}, [])

const tweenAll = tweens.reduce((a, b) => c => a(() => b(c)))

scene.add(
  camera,
  directionalLight,
  ambientLight,
  wrapper
)

resize()
tweenAll()
