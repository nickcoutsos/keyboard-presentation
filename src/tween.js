import { Object3D, Vector3 } from 'three'
import { difference, mapValues } from 'lodash'
import * as layouts from './layouts'
import * as animation from './animation'

const getNodeTransforms = node => ({
  scale: node.scale.clone(),
  position: node.getWorldPosition(),
  quaternion: node.getWorldQuaternion()
})

export class Tweener {
  constructor (renderFrame, source, target) {
    this.renderFrame = renderFrame
    this.wrapper = new Object3D()
    this.source = source
    this.target = target

    const sourceKeyMap = layouts.makeKeymap(source)
    const targetKeyMap = layouts.makeKeymap(target)
    const sourceKeys = Object.keys(sourceKeyMap)
    const targetKeys = Object.keys(targetKeyMap)
    this.begin = mapValues(sourceKeyMap, getNodeTransforms)
    this.end = mapValues(targetKeyMap, getNodeTransforms)

    sourceKeys.forEach(key => this.wrapper.add(sourceKeyMap[key].clone()))

    difference(sourceKeys, targetKeys).forEach(key => {
      this.end[key] = {
        scale: new Vector3(0, 0, 0),
        position: sourceKeyMap[key].position.clone().sub(new Vector3(0, 0, 5)),
        quaternion: sourceKeyMap[key].quaternion.clone()
      }
    })

    difference(targetKeys, sourceKeys).forEach(key => {
      this.wrapper.add(targetKeyMap[key].clone())
      this.begin[key] = {
        scale: new Vector3(0, 0, 0),
        position: targetKeyMap[key].position.clone().sub(new Vector3(0, 0, 5)),
        quaternion: targetKeyMap[key].quaternion.clone()
      }
    })
  }

  reset () {
    this.wrapper.traverse(node => {
      const { id } = node.userData
      const a = this.begin[id]
      if (!a) return

      node.scale.copy(a.scale)
      node.position.copy(a.position)
      node.quaternion.copy(a.quaternion)
      node.updateMatrix()
    })
  }

  play (duration) {
    return animation.animate(
      t => this.tween(t),
      duration,
      animation.easeOutQuad
    )()
  }

  reverse (duration) {
    return animation.animate(
      t => this.tween(1 - t),
      duration,
      animation.easeOutQuad
    )()
  }

  tween (t) {
    this.wrapper.traverse(node => {
      const { id } = node.userData
      const a = this.begin[id]
      const b = this.end[id]

      if (!(a && b)) {
        return
      }

      node.scale.copy(a.scale).lerp(b.scale, t)
      node.position.copy(a.position).lerp(b.position, t)
      node.quaternion.copy(a.quaternion).slerp(b.quaternion, t)
    })

    this.renderFrame()
  }
}
