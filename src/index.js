import { values } from 'lodash'
import * as layouts from './layouts'
import * as dactyl from './dactyl'
import * as materials from './materials'
import Ruler from './ruler'
import tween from './tween'
import * as viewer from './viewer'
import './style.css'

const keyboards = [
  layouts.makeKeyboard(layouts.classic),
  layouts.makeKeyboard(layouts.apple),
  layouts.makeKeyboard(layouts.preonic),
  layouts.makeKeyboard(layouts.split),
  layouts.makeKeyboard(layouts.ergodox),
  dactyl.makeKeyboard()
]

const wrapper = keyboards[0].clone()

let i = 0, cancel
let activeKeymap = layouts.makeKeymap(wrapper)

window.addEventListener('keyup', ({ key }) => {
  const current = keyboards[i]

  if (key === 'ArrowRight' && i < keyboards.length - 1) {
    const next = keyboards[i + 1]
    const { start, stop } = tween(viewer.renderFrame, wrapper, current, next, 500)

    cancel && cancel()
    cancel = stop
    i += 1
    activeKeymap = layouts.makeKeymap(wrapper)
    start(() => { cancel = null })
  } else if (key === 'ArrowLeft' && i > 0) {
    const next = keyboards[i - 1]
    const { start, stop } = tween(viewer.renderFrame, wrapper, current, next, 500)

    cancel && cancel()
    cancel = stop

    i -= 1
    activeKeymap = layouts.makeKeymap(wrapper)
    start(() => { cancel = null })
  }
})

const keyHighlight = (event) => {
  const { type, key, repeat, altKey, ctrlKey, metaKey, shiftKey } = event

  if (repeat || altKey || ctrlKey || metaKey || shiftKey) {
    return
  }

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

  measureDistance()
  viewer.renderFrame()
}

const measureDistance = () => {
  const heldKeys = values(activeKeymap)
    .filter(node => node.material === materials.highlight)

  heldKeys.length === 2
    ? ruler.measure(...heldKeys)
    : ruler.hide()
}

window.addEventListener('keydown', keyHighlight)
window.addEventListener('keyup', keyHighlight)

viewer.init()
viewer.scene.add(wrapper)
viewer.renderFrame()
const ruler = new Ruler(viewer)
viewer.resize()
