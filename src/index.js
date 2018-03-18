import { throttle } from 'lodash'
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
import * as materials from './materials'
import tween from './tween'
import './style.css'

const container = document.querySelector('#app')
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
const scene = new Scene()

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
container.appendChild(renderer.domElement)
window.addEventListener('resize', resize)

const renderFrame = throttle(() => {
  renderer.render(scene, camera)
}, 16)

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

const wrapper = keyboards[0].clone()

scene.add(
  camera,
  directionalLight,
  ambientLight,
  wrapper
)

resize()

let i = 0, cancel
let activeKeymap = layouts.makeKeymap(wrapper)

window.addEventListener('keyup', ({ key }) => {
  const current = keyboards[i]

  if (key === 'ArrowRight' && i < keyboards.length - 1) {
    const next = keyboards[i + 1]
    const { start, stop } = tween(renderFrame, wrapper, current, next, 150)

    cancel && cancel()
    cancel = stop
    i += 1
    activeKeymap = layouts.makeKeymap(wrapper)
    start(() => { cancel = null })
  } else if (key === 'ArrowLeft' && i > 0) {
    const next = keyboards[i - 1]
    const { start, stop } = tween(renderFrame, wrapper, current, next, 150)

    cancel && cancel()
    cancel = stop

    i -= 1
    activeKeymap = layouts.makeKeymap(wrapper)
    start(() => { cancel = null })
  }
})

const keyHighlight = (event) => {
  const { type, key } = event
  if (!/[a-zA-Z0-9;'\-=,./[\]]/.test(key)) {
    return
  }

  const node = activeKeymap[key]

  if (!node) {
    return
  }

  event.preventDefault()

  node.material = type === 'keydown'
    ? materials.highlight
    : materials.primary

  renderFrame()
}

window.addEventListener('keydown', keyHighlight)
window.addEventListener('keyup', keyHighlight)
