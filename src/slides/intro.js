import * as parts from '../parts'
import * as viewer from '../viewer'

const recordScratch = new Audio('dist/assets/record-scratch.wav')
const rewind = new Audio('dist/assets/rewind.wav')

rewind.volume = .4
rewind.playbackRate = 5
rewind.loop = true

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
  rewind.pause()
  parts.scene.visible = false
  viewer.toggleEffect('pause', false)
  viewer.renderFrame()
  animation && cancelAnimationFrame(animation)
}

let animation
let rotation = .035
const animate = () => {
  if (rotation) {
    parts.scene.rotation.z -= rotation
  }

  viewer.renderFrame()
  animation = requestAnimationFrame(animate)
}

export const fragment = (state) => {
  if (state.previousFragment == 1) {
    rewind.pause()
  }

  switch (state.fragment) {
    case -1:
      rotation = 0.035
      parts.scene.visible = true
      viewer.toggleEffect('pause', false)
      break
    case 0:
      rotation = 0
      viewer.toggleEffect('pause', true)
      if (state.previousFragment < state.fragment) {
        recordScratch.play()
      }
      break
    case 1: 
      rotation = -.5
      viewer.toggleEffect('pause', true)
      rewind.play()
      break
    case 2:
      parts.scene.visible = false
      break
  }
}
