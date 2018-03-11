import { Quaternion } from 'three'
import * as layouts from './layouts'
import * as animation from './animation'

export default (renderFrame, source, target, duration) => {
  const original = source.clone()
  const sourceKeyboardMap = layouts.makeKeymap(original)
  const targetKeyboardMap = layouts.makeKeymap(target)

  return animation.animate(t => {
    source.traverse(node => {
      const { quaternion, position } = node
      const { id } = node.userData
      if (id) {
        const a = sourceKeyboardMap[id]
        const b = targetKeyboardMap[id]

        if (!(a && b)) {
          return
        }

        const aQuat = a.getWorldQuaternion()
        const bQuat = b.getWorldQuaternion()
        const aScale = a.scale
        const bScale = b.scale
        const aPos =  a.getWorldPosition()
        const bPos =  b.getWorldPosition()

        Quaternion.slerp(aQuat, bQuat, quaternion, t)
        position.copy(aPos.clone().lerp(bPos, t))
        node.scale.copy(aScale.clone().lerp(bScale, t))
      }
    })

    renderFrame()
  }, duration)
}
