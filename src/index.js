import * as layouts from './layouts'
import * as dactyl from './dactyl'
import * as materials from './materials'
import tween from './tween'
import { renderFrame, init, scene } from './viewer'

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

init()
scene.add(wrapper)
renderFrame()
