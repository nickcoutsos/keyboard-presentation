import { Vector3, Plane } from 'three'
import * as animation from '../animation'
import * as parts from '../parts'
import * as viewer from '../viewer'

let sceneParts
const xPlane = { normal: new Vector3(-1, 0, 0), start: new Vector3(-10, 0, 0), end: new Vector3(10, 0, 0) }
const yPlane = { normal: new Vector3(0, 1, 0), start: new Vector3(0, 5, 0), end: new Vector3(0, -5, 0) }

export const initialize = () => {
  sceneParts = parts.scene.clone()
  const mainSupports = sceneParts.getObjectByName('mainSupports')
  const crossSupports = sceneParts.getObjectByName('crossSupports')

  mainSupports.material = mainSupports.material.clone()
  crossSupports.material = crossSupports.material.clone()
  mainSupports.material.clippingPlanes = [new Plane().setFromNormalAndCoplanarPoint(yPlane.normal, yPlane.start)]
  crossSupports.material.clippingPlanes = [new Plane().setFromNormalAndCoplanarPoint(xPlane.normal, xPlane.start)]

  viewer.scene.add(sceneParts)
}

export const activate = () => {
  sceneParts.visible = true
  viewer.renderFrame()
}

export const deactivate = () => {
  sceneParts.visible = false
  viewer.renderFrame()
}

export const fragment = (state) => {
  const [xClippingPlane] = sceneParts.getObjectByName('crossSupports').material.clippingPlanes
  const [yClippingPlane] = sceneParts.getObjectByName('mainSupports').material.clippingPlanes

  if (state.fragment === -1) {
    if (state.previousFragment > state.fragment) {
      animation.animate(t => {
        yClippingPlane.setFromNormalAndCoplanarPoint(yPlane.normal, yPlane.end.clone().lerp(yPlane.start, t))
        viewer.renderFrame()
      }, 2000).start()
    }
  } else if (state.fragment === 0 || state.fragment === 1) {
    const clippingPlane = state.previousFragment === -1 ? yClippingPlane : xClippingPlane
    const plane = state.previousFragment === -1 ? yPlane : xPlane
    const [start, end] = state.previousFragment < state.fragment
      ? [ plane.start, plane.end ]
      : [ plane.end, plane.start ]

    animation.animate(t => {
      clippingPlane.setFromNormalAndCoplanarPoint(plane.normal, start.clone().lerp(end, t))
      viewer.renderFrame()
    }, 1500).start()
  }
}
