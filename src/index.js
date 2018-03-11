import { AmbientLight, DirectionalLight, PerspectiveCamera, Quaternion, Scene, Vector3, WebGLRenderer } from 'three';
import * as layouts from './layouts'
import * as dactyl from './dactyl'
import './style.css'

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
const scene = new Scene()

function resize () {
  const element = document.querySelector('#app')
  const { width, height } = element.getBoundingClientRect()

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

const keyboard = layouts.makeKeyboard(layouts.ergodox)
const source = layouts.makeKeyboard(layouts.ergodox)
const target = dactyl.makeKeyboard()

const sourceKeyboardMap = layouts.makeKeymap(source)
const targetKeyboardMap = layouts.makeKeymap(target)
// const tweenKeyboardMap = layouts.makeKeymap(keyboard)

function animate(t=0) {
  const t_ = (1 + Math.sin(t / 1000)) / 2

  keyboard.traverse(node => {
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
      const aPos =  a.getWorldPosition()
      const bPos =  b.getWorldPosition()

      Quaternion.slerp(aQuat, bQuat, quaternion, t_)
      position.copy(aPos.clone().lerp(bPos, t_))
    }
  })

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

const light = new DirectionalLight('white', 1)
light.position.set(0, 5, 5)

camera.position.set(-5, -10, 10)
camera.up.set(0, 0, 1)
camera.lookAt(new Vector3(0, 0, 0))

scene.add(camera, light, new AmbientLight('powderblue', .8))
scene.add(layouts.makeKeyboard(layouts.ergodox))
// scene.add(dactyl.makeKeyboard())
scene.add(keyboard)


renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
document.querySelector('#app').appendChild(renderer.domElement)
window.addEventListener('resize', resize)

resize()
animate()
