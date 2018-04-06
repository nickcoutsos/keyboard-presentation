import { Object3D } from 'three'
import { clamp } from 'lodash'
import * as viewer from '../viewer'
import * as animation from '../animation'
import { ergodox, dactyl } from '../keyboards'
import { makeTween } from '../tween'

const music = new Audio('dist/assets/the-leftovers-departure.m4a')
music.volume = .4

const volumeControl = ({ key }) => {
  if (key !== 'ArrowUp' && key !== 'ArrowDown') {
    return
  }

  const change = .01 * (key === 'ArrowUp' ? 1 : -1)
  music.volume = clamp(music.volume + change, 0, 1)
}

const wrapper = new Object3D()
const tween = makeTween(wrapper, ergodox, dactyl)
const clip = animation.animate(t => {
  wrapper.rotation.z = t * 2
  tween(Math.pow(t*3, 4))
  viewer.renderFrame()
}, 60000)

export const initialize = () => {
  wrapper.visible = false
  viewer.scene.add(wrapper)
}

export const activate = () => {
  console.log('wtf')
  window.addEventListener('keydown', volumeControl)
  wrapper.visible = true
  clip.start()
  music.currentTime = 0
  music.play()
}

export const deactivate = () => {
  window.removeEventListener('keypress', volumeControl)
  wrapper.visible = false
  clip.stop()
  music.pause()
}
