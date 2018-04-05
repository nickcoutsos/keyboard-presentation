import { Object3D } from 'three'
import * as viewer from '../viewer'
import * as animation from '../animation'
import { ergodox, dactyl } from '../keyboards'
import { makeTween } from '../tween'

const wrapper = new Object3D()
const tween = makeTween(wrapper, ergodox, dactyl)
const clip = animation.animate(t => {
  wrapper.rotation.z = t * 2
  tween(Math.pow(t*3, 4))
  viewer.renderFrame()
}, 50000)

export const initialize = () => {
  wrapper.visible = false
  viewer.scene.add(wrapper)
}

export const activate = () => {
  wrapper.visible = true
  clip.start()
}

export const deactivate = () => {
  wrapper.visible = false
  clip.stop()
}
