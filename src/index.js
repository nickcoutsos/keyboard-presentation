import { values } from 'lodash'
import { Color } from 'three'
import * as animation from './animation'
import * as layouts from './layouts'
import * as dactyl from './dactyl'
import * as materials from './materials'
import Ruler from './ruler'
import tween from './tween'
import * as viewer from './viewer'
import * as slideshow from './slideshow'
import './style.scss'

const keyboards = [
  layouts.makeKeyboard(layouts.classic),
  layouts.makeKeyboard(layouts.apple),
  layouts.makeKeyboard(layouts.split),
  layouts.makeKeyboard(layouts.ergodox),
  dactyl.makeKeyboard()
]

const wrapper = keyboards[0].clone()

let cancel
let activeKeymap = layouts.makeKeymap(wrapper)

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

slideshow.initialize()
slideshow.events.on('slidechanged', ({ previousSlideIndex, previousSlide, slide, state }) => {
  const prev = keyboards[previousSlideIndex]
  const next = keyboards[state.slide]
  const { start, stop } = tween(viewer.renderFrame, wrapper, prev, next, 500)

  cancel && cancel()
  cancel = stop

  activeKeymap = layouts.makeKeymap(wrapper)
  start(() => { cancel = null })

  const prevColor = new Color(window.getComputedStyle(previousSlide).backgroundColor)
  const nextColor = new Color(window.getComputedStyle(slide).backgroundColor)
  const colorTween = animation.animate(t => {
    const color = prevColor.clone().lerp(nextColor, t)
    const ambientLight = viewer.scene.getObjectByName('ambient')
    ambientLight.color = color
  }, 500)

  colorTween.start()
})
