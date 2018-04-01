import { Plane, Vector3 } from 'three'
import { linear, easeInOutCubic } from 'easing-utils'
import * as animation from '../animation'
import * as parts from '../parts'
import * as viewer from '../viewer'

let sceneParts
const mainClippingPlane = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3())
const crossClippingPlane = new Plane().setFromNormalAndCoplanarPoint(new Vector3(-1, 0, 0), new Vector3())

mainClippingPlane.constant = -3.25
crossClippingPlane.constant = -10

export const initialize = () => {
  sceneParts = parts.scene.clone()
  const mainSupports = sceneParts.getObjectByName('mainSupports')
  const crossSupports = sceneParts.getObjectByName('crossSupports')
  const plates = sceneParts.getObjectByName('plates')

  plates.material = plates.material.clone()
  plates.material.transparent = true

  mainSupports.material = mainSupports.material.clone()
  mainSupports.material.clippingPlanes = [mainClippingPlane]

  crossSupports.material = crossSupports.material.clone()
  crossSupports.material.clippingPlanes = [crossClippingPlane]

  viewer.scene.add(sceneParts)
}

export const activate = () => {
  sceneParts.visible = true
  animating = animate()
}

export const deactivate = () => {
  sceneParts.visible = false
  viewer.renderFrame()
  cancelAnimationFrame(animating)
}

let animating = false
function animate () {
  sceneParts.rotation.z += .01
  sceneParts.updateMatrix()
  mainClippingPlane.normal.set(0, 1, 0).applyMatrix4(sceneParts.matrix)
  crossClippingPlane.normal.set(-1, 0, 0).applyMatrix4(sceneParts.matrix)

  animating = requestAnimationFrame(animate)
  viewer.renderFrame()
}

export const fragment = ({ fragment, previousFragment }) => {
  if (previousFragment > fragment) {
    transitions[previousFragment].reverse()
  } else {
    transitions[fragment].start()
  }
}

const removeCaps = animation.animate(t => {
  sceneParts.getObjectByName('caps').position
    .copy(new Vector3(0, 0, 0))
    .lerp(new Vector3(0, 0, 15), t)

  viewer.renderFrame()
}, 1500, easeInOutCubic)

const ghostPlates = animation.animate(t => {
  sceneParts.getObjectByName('plates').material.opacity = 1 - t * .5
  viewer.renderFrame()
}, 1500, linear)

const drawMainSupports = animation.animate(t => {
  mainClippingPlane.constant = -3.25 + 8 * t
  viewer.renderFrame()
}, 1500, easeInOutCubic)

const drawCrossSupports = animation.animate(t => {
  crossClippingPlane.constant = -10 + 20 * t
  viewer.renderFrame()
}, 2500, linear)

const transitions = [
  removeCaps,
  ghostPlates,
  drawMainSupports,
  drawCrossSupports
]
