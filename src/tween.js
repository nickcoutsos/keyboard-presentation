import { Vector3 } from 'three'
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
  const sourceKeys = layouts.makeKeymap(original)
  const targetKeys = layouts.makeKeymap(target)
  const begin = mapValues(sourceKeys, getNodeTransforms)
  const end = mapValues(targetKeys, getNodeTransforms)


  Object.keys(begin).forEach(key => {
    if (end[key]) return

    target.add(sourceKeys[key].clone())
    end[key] = {
      scale: new Vector3(0, 0, 0),
      position: begin[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: begin[key].quaternion.clone()
    }
  })

  Object.keys(end).forEach(key => {
    if (begin[key]) return

    source.add(targetKeys[key].clone())
    begin[key] = {
      scale: new Vector3(0, 0, 0),
      position: end[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: end[key].quaternion.clone()
    }
  })

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