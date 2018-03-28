import { Vector3 } from 'three'

const createElement = (tag, attributes) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag)
  updateElement(element, attributes)

  return element
}

const updateElement = (selectorOrElement, attributes, textContent) => {
  const element = typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement

  for (let key in attributes) {
    element.setAttribute(key, attributes[key])
  }

  if (textContent) {
    element.textContent = textContent
  }
}

const createOverlay = () => {
  const overlay = createElement('svg')

  overlay.appendChild(createElement('line', {
    id: 'line',
    stroke: 'red',
    'stroke-dasharray': '16 8',
    'stroke-width': 3
  }))

  overlay.appendChild(createElement('text', {
    id: 'text',
    fill: 'white',
    stroke: 'black',
    'stroke-width': 2.5,
    'font-family': 'Gill Sans',
    'font-weight': 'bold',
    'font-size': '48px'
  }))

  return overlay
}

export class Ruler {
  constructor (viewer) {
    this.overlay = createOverlay()
    this.viewer = viewer
    this.viewer.renderer.domElement.parentNode.appendChild(this.overlay)
    this.viewer.onResize((width, height) => {
      this.width = width
      this.height = height
      this.overlay.style.position = 'absolute'
      this.overlay.style.left = '0'
      this.overlay.style.top = '0'
      this.overlay.style.width = width
      this.overlay.style.height = height
      this.overlay.style.display = 'none'
      updateElement(this.overlay, {
        preserveAspectRatio: 'xMinYMin',
        width,
        height
      })
    })
  }

  toScreen (v) {
    const widthHalf = this.width / 2
    const heightHalf = this.height / 2

    return {
      x: v.x * widthHalf + widthHalf,
      y: v.y * -heightHalf + heightHalf
    }
  }

  measure (a, b) {
    const dist = a.position.distanceTo(b.position).toPrecision(3)
    const aProj = a.position.clone().add(new Vector3(0, 0, .1525)).project(this.viewer.camera)
    const bProj = b.position.clone().add(new Vector3(0, 0, .1525)).project(this.viewer.camera)
    const screenA = this.toScreen(aProj)
    const screenB = this.toScreen(bProj)
    const mid = this.toScreen(aProj.clone().lerp(bProj, .5))
    const angle = Math.atan((screenB.y - screenA.y) / (screenB.x - screenA.x)) * 180/Math.PI

    this.overlay.style.display = 'block'

    updateElement('#line', {
      x1: screenA.x,
      y1: screenA.y,
      x2: screenB.x,
      y2: screenB.y
    })

    updateElement('#text', {
      x: mid.x,
      y: mid.y,
      dy: -10,
      'text-anchor': 'middle',
      transform: `rotate(${angle}, ${mid.x}, ${mid.y})`
    }, dist)

  }

  hide () {
    this.overlay.style.display = 'none'
  }
}

export default Ruler
