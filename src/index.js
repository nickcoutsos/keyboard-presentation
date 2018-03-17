import { zip } from 'lodash'
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';

import * as layouts from './layouts'
import * as dactyl from './dactyl'
import { Tweener } from './tween'
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

const keyboards = [
  layouts.makeKeyboard(layouts.classic),
  layouts.makeKeyboard(layouts.apple),
  layouts.makeKeyboard(layouts.preonic),
  layouts.makeKeyboard(layouts.split),
  layouts.makeKeyboard(layouts.ergodox),
  dactyl.makeKeyboard()
]

const phases = zip(keyboards.slice(0, -1), keyboards.slice(1))
const tweens = phases.map(phase => new Tweener(renderFrame, ...phase))

scene.add(
  camera,
  directionalLight,
  ambientLight,
  tweens[0].wrapper
)

resize()
tweens[0].play(1500)
