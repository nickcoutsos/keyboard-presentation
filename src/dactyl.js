import { Matrix4, Object3D, Vector3 } from 'three'
import { flatten, times } from 'lodash'
import { makeKey } from './layouts'

const translation = v => new Matrix4().makeTranslation(v.x, v.y, v.z)
const rotationX = a => new Matrix4().makeRotationX(a)
const rotationY = a => new Matrix4().makeRotationY(a)
const rotationZ = a => new Matrix4().makeRotationZ(a)
const rotationXY = a => new Matrix4().makeRotationAxis(
  new Vector3(1, 1, 0).normalize(), a
)

const alpha = (180 / 12) *(Math.PI / 180)
const beta = (180 / 36) *(Math.PI / 180)
const capTopHeight = .25
const mountWidth = 2 + 3
const mountHeight = 2 + 3
const mainRowRadius = (mountHeight + .5) / 2 / Math.sin(alpha/2)/5
const mainColumnRadius = (mountWidth + .5) / 2 / Math.sin(beta/2)/5
const thumbRowRadius = (mountHeight + .25) / 2 / Math.sin(alpha/2)/5
const thumbColumnRadius = (mountWidth + 1.5) / 2 / Math.sin(beta/2)/5

const columnOffsets = [
  new Vector3(0, 0, 0).divideScalar(2),
  new Vector3(0, 0, 0).divideScalar(2),
  new Vector3(0, .282, -.3).divideScalar(2),
  new Vector3(0, 0, 0).divideScalar(2),
  new Vector3(0, -.58, .564).divideScalar(2),
  new Vector3(0, -.58, .564).divideScalar(2)
]

const positionKey = (column, row) => {
  const rowAngle = alpha * (2 - row)
  const columnAngle = beta * (2 - column)
  const columnOffset = columnOffsets[column]

  return new Matrix4()
    // .multiply(translation(new Vector3(0, 0, 13)))
    .multiply(rotationY(alpha))
    .multiply(translation(columnOffset))
    .multiply(translation(new Vector3(0, 0, mainColumnRadius)))
    .multiply(rotationY(columnAngle))
    .multiply(translation(new Vector3(0, 0, -mainColumnRadius)))
    .multiply(translation(new Vector3(0, 0, .5)))
    .multiply(translation(new Vector3(0, 0, mainRowRadius)))
    .multiply(rotationX(rowAngle))
    .multiply(translation(new Vector3(0, 0, -mainRowRadius)))
}

const positionThumbKey = (column, row) => {
  const rowAngle = alpha * row
  const columnAngle = beta * column

  return new Matrix4()
    .multiply(translation(new Vector3(-7.5, -2.2, -2)))
    .multiply(rotationXY(alpha))
    .multiply(rotationZ((Math.PI / 180) * 180 * (.25 - .1875)))
    .multiply(translation(new Vector3(mountWidth, 0, 0)))
    .multiply(translation(new Vector3(0, 0, thumbColumnRadius)))
    .multiply(rotationY(columnAngle))
    .multiply(translation(new Vector3(0, 0, -thumbColumnRadius)))
    .multiply(translation(new Vector3(0, 0, 4)))
    .multiply(translation(new Vector3(0, 0, thumbRowRadius)))
    .multiply(rotationX(rowAngle))
    .multiply(translation(new Vector3(0, 0, -thumbRowRadius)))
}

const makeKeyboard = () => {
  const keyboard = new Object3D()
  const makeColumn = col => (label, row) => ({ col, row, label })

  const leftKeys = flatten([
    ['5', 't', 'g', 'b'].map(makeColumn(0)),
    ['4', 'r', 'f', 'v', ''].map(makeColumn(1)),
    ['3', 'e', 'd', 'c', ''].map(makeColumn(2)),
    ['2', 'w', 's', 'x', ''].map(makeColumn(3)),
    ['1', 'q', 'a', 'z', ''].map(makeColumn(4)),
    times(4).map(n => ({ col: 5, row: n, w: 1.5})),
    { col: 5, row: 4 }
  ])

  const rightKeys = flatten([
    ['6', 'y', 'h', 'n'].map(makeColumn(0)),
    ['7', 'u', 'j', 'm', ''].map(makeColumn(1)),
    ['8', 'i', 'k', ',', ''].map(makeColumn(2)),
    ['9', 'o', 'l', '.', ''].map(makeColumn(3)),
    ['0', 'p', ';', '/', ''].map(makeColumn(4)),
    times(4).map(n => ({ col: 5, row: n, w: 1.5})),
    { col: 5, row: 4 }
  ])

  const thumbKeys = [
    { col: 2, row: -1 },
    { col: 2, row: 0 },
    { col: 2, row: 1 },
    { col: 1, row: 1 },
    { col: 0, row: -0.5, h: 2 },
    { col: 1, row: -0.5, h: 2 }
  ]

  const rightHand = new Object3D()
  const leftHand = new Object3D()

  keyboard.add(leftHand, rightHand)

  for (let {col, row, label, w} of rightKeys) {
    const key = makeKey(w || 1, 1, !!label)
    key.applyMatrix(positionKey(col, row))
    key.userData.label = label

    if (w) {
      key.applyMatrix(translation(new Vector3(w/6, 0, 0)))
    }

    rightHand.add(key)
  }

  for (let {col, row, label, w} of leftKeys) {
    const key = makeKey(w || 1, 1, !!label)
    key.applyMatrix(positionKey(col, row))
    key.userData.label = label

    if (w) {
      key.applyMatrix(translation(new Vector3(w/6, 0, 0)))
    }

    leftHand.add(key)
  }

  rightHand.position.x = 5
  leftHand.scale.x = -1
  leftHand.position.x = -5

  for (let {col, row, h} of thumbKeys) {
    const key = makeKey(1, h || 1)
    key.applyMatrix(positionThumbKey(col, row))
    rightHand.add(key)
  }

  for (let {col, row, h} of thumbKeys) {
    const key = makeKey(1, h || 1)
    key.applyMatrix(positionThumbKey(col, row))
    leftHand.add(key)
  }

  keyboard.updateMatrixWorld()

  return keyboard
}

export { makeKeyboard }
