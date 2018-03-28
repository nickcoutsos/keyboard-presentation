import { values } from 'lodash'
import { Color, Object3D } from 'three'
import * as animation from './animation'
import { makeKeymap } from './layouts'
import * as keyboards from './keyboards'
import * as materials from './materials'
import Ruler from './ruler'
import tween from './tween'
import * as viewer from './viewer'
import * as slideshow from './slideshow'
import './style.scss'

const wrapper = new Object3D()

let cancel
let activeKeymap = makeKeymap(wrapper)

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
slideshow.events.on('slidechanged', ({ previousSlide, slide }) => {
  const prev = keyboards[previousSlide.dataset.keyboardLayout]
  const next = keyboards[slide.dataset.keyboardLayout]

  tweenColours(
    window.getComputedStyle(previousSlide).backgroundColor,
    window.getComputedStyle(slide).backgroundColor
  )

  if (prev && next) {
    tweenKeyboards(prev, next)
  } else {
    wrapper.remove(...wrapper.children)
    if (next) {
      wrapper.add(...next.children.map(child => child.clone()))
      viewer.renderFrame()
    }
  }

  activeKeymap = makeKeymap(wrapper)
})

const tweenKeyboards = (begin, end) => {
  const { start, stop } = tween(viewer.renderFrame, wrapper, begin, end, 500)
  cancel && cancel()
  cancel = stop

  activeKeymap = makeKeymap(wrapper)
  start(() => { cancel = null })
}

const tweenColours = (begin, end) => {
  const beginColour = new Color(begin)
  const endColour = new Color(end)

  animation.animate(t => {
    const color = beginColour.clone().lerp(endColour, t)
    const ambientLight = viewer.scene.getObjectByName('ambient')
    ambientLight.color = color
    viewer.renderFrame()
  }, 500).start()
}
