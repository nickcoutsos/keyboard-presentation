import { mapValues } from 'lodash'
import * as layouts from './layouts'
import * as animation from './animation'

const getNodeTransforms = node => ({
  scale: node.scale,
  position: node.getWorldPosition(),
  quaternion: node.getWorldQuaternion()
})

export default (renderFrame, source, target, duration) => {
  const original = source.clone()
  const begin = mapValues(layouts.makeKeymap(original), getNodeTransforms)
  const end = mapValues(layouts.makeKeymap(target), getNodeTransforms)

  return animation.animate(t => {
    source.traverse(node => {
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

    renderFrame()
  }, duration)
}
