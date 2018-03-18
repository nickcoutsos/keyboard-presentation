import { BoxGeometry, Mesh } from 'three'
import * as materials from './materials'

export default (w, h, primary) => {
  const x = w - .15
  const y = h - .15

  const key = new Mesh(
    new BoxGeometry(1, 1, .35),
    materials[ primary ? 'primary' : 'secondary' ]
  )

  key.scale.x = x
  key.scale.y = y
  key.updateMatrix()

  return key
}
