import { linear } from 'easing-utils'

export const animate = (frame, duration = 100, timingFunction = linear) => {
  let direction = 1
  let start_
  let callback_

  function start (callback = () => {}) {
    direction = 1
    start_ = Date.now()
    callback_ = callback
    animate()
  }

  function reverse (callback = () => {}) {
    direction = -1
    start_ = Date.now()
    callback_ = callback
    animate()
  }

  function stop () {
    start_ = undefined
  }

  function animate () {
    const now = Date.now()
    const delta = now - start_
    const f = delta / duration
    const t = Math.max(0, Math.min(1, direction > 0 ? f : (1 - f)))

    frame(timingFunction(t))

    if ((t < 1 && direction > 0) || (t > 0 && direction < 0)) {
      requestAnimationFrame(animate)
    } else {
      stop()
      callback_()
      return
    }

  }

  return {
    start,
    stop,
    reverse
  }
}
