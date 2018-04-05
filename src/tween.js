import { Vector3 } from 'three'
import { mapValues } from 'lodash'
import { easeInOutCubic } from 'easing-utils'
import * as layouts from './layouts'
import * as animation from './animation'

const getNodeTransforms = node => ({
  scale: node.scale,
  position: node.getWorldPosition(),
  quaternion: node.getWorldQuaternion()
})

const ZEROISH = 1e-10

export const makeTween = (container, source, target) => {
  const sourceKeys = layouts.makeKeymap(source)
  const targetKeys = layouts.makeKeymap(target)
  const begin = mapValues(sourceKeys, getNodeTransforms)
  const end = mapValues(targetKeys, getNodeTransforms)

  container.remove(...container.children)
  const availableKeys = Object.keys(sourceKeys).map(key => sourceKeys[key].clone())
  if (availableKeys.length > 0) {
    container.add(...availableKeys)
  }

  Object.keys(begin).forEach(key => {
    if (end[key]) return

    end[key] = {
      scale: new Vector3(ZEROISH, ZEROISH, ZEROISH),
      position: begin[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: begin[key].quaternion.clone()
    }
  })

  Object.keys(end).forEach(key => {
    if (begin[key]) return

    container.add(targetKeys[key].clone())

    begin[key] = {
      scale: new Vector3(ZEROISH, ZEROISH, ZEROISH),
      position: end[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: end[key].quaternion.clone()
    }
  })

  return t => {
    container.traverse(node => {
      const { id } = node.userData
      const a = begin[id]
      const b = end[id]

      if (!(a && b)) {
        return
      }

      node.scale.copy(a.scale).lerp(b.scale, t)
      node.position.copy(a.position).lerp(b.position, t)
      node.quaternion.copy(a.quaternion).slerp(b.quaternion, t)
    })
  }
}

export default (renderFrame, container, source, target, duration) => {
  const tween = makeTween(container, source, target)

  return animation.animate(t => {
    tween(t)
    renderFrame()
  }, duration, easeInOutCubic)
}
