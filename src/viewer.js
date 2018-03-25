import { throttle } from 'lodash'
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget
} from 'three'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import pauseEffect from './pause-effect'

const container = document.querySelector('#app')

export const renderer = new WebGLRenderer({ antialias: true, alpha: true });
export const renderTarget = new WebGLRenderTarget(2000, 2000)
export const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
export const scene = new Scene()
export const composer = new EffectComposer(renderer, renderTarget)

const pausePass = Object.assign(new ShaderPass(pauseEffect), { enabled: false })
const copyPass = Object.assign(new ShaderPass(CopyShader), { renderToScreen: true })
const start = Date.now()

export const renderFrame = throttle(() => {
  pausePass.uniforms.time.value = (Date.now() - start) / 1000
  composer.render()
}, 16)

export const init = () => {
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', resize)

  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(pausePass)
  composer.addPass(copyPass)

  const ambientLight = new AmbientLight('powderblue', .8)
  const directionalLight = new DirectionalLight('white', 1)
  ambientLight.name = 'ambient'
  directionalLight.position.set(0, 5, 5)

  camera.position.set(-5, -10, 10)
  camera.up.set(0, 0, 1)
  camera.lookAt(new Vector3(0, 0, 0))

  scene.add(
    camera,
    directionalLight,
    ambientLight
  )

  resize()
}

export const togglePauseEffect = () => {
  pausePass.enabled = !pausePass.enabled
}

let resizeHandler = () => {}
export const onResize = (handler) => { resizeHandler = handler }

export function resize () {
  const { width, height } = container.getBoundingClientRect()

  renderer.setSize(width, height)
  renderTarget.setSize(width, height)
  pausePass.uniforms.resolution.value.set(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  resizeHandler(width, height)
  renderFrame()
}
