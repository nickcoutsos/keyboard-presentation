import { Vector3 } from 'three'
import { mapValues } from 'lodash'
import * as layouts from './layouts'
import * as animation from './animation'

const getNodeTransforms = node => ({
  scale: node.scale.clone(),
  position: node.getWorldPosition(),
  quaternion: node.getWorldQuaternion()
})

export default (renderFrame, container, source, target, duration) => {
  const sourceKeys = layouts.makeKeymap(source)
  const targetKeys = layouts.makeKeymap(target)
  const begin = mapValues(sourceKeys, getNodeTransforms)
  const end = mapValues(targetKeys, getNodeTransforms)

  container.remove(...container.children)
  container.add(...Object.keys(sourceKeys).map(key => sourceKeys[key].clone()))

  Object.keys(begin).forEach(key => {
    if (end[key]) return

    end[key] = {
      scale: new Vector3(0, 0, 0),
      position: begin[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: begin[key].quaternion.clone()
    }
  })

  Object.keys(end).forEach(key => {
    if (begin[key]) return

    container.add(targetKeys[key].clone())

    begin[key] = {
      scale: new Vector3(0, 0, 0),
      position: end[key].position.clone().sub(new Vector3(0, 0, 5)),
      quaternion: end[key].quaternion.clone()
    }
  })

  return animation.animate(t => {
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

    renderFrame()
  }, duration, animation.easeOutQuad)
}
