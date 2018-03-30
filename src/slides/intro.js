import * as parts from '../parts'
import * as viewer from '../viewer'

export const initialize = () => {
  viewer.scene.add(parts.scene)
  parts.scene.visible = false
}

export const activate = (state) => {
  parts.scene.visible = true
  fragment(state)
  animate()
}

export const deactivate = () => {
  parts.scene.visible = false
  viewer.toggleEffect('pause', false)
  viewer.renderFrame()
  animation && cancelAnimationFrame(animation)
}

let animation
let rotation = .02
const animate = () => {
  if (rotation) {
    parts.scene.rotation.z -= rotation
  }

  viewer.renderFrame()
  animation = requestAnimationFrame(animate)
}

export const fragment = (state) => {
  switch (state.fragment) {
    case -1:
      rotation = 0.02
      parts.scene.visible = true
      viewer.toggleEffect('pause', false)
      break
    case 0:
      rotation = 0
      viewer.toggleEffect('pause', true)
      break
    case 1: 
      rotation = -.7
      viewer.toggleEffect('pause', true)
      break
    case 2:
      parts.scene.visible = false
      break
  }
}
