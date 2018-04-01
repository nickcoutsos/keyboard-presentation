const theme = new Audio('dist/assets/back-to-the-future-intro.wav')

export const fragment = (state) => {
  // play theme only when advancing through slideshow
  if (state.fragment === 0 && state.previousFragment === -1) {
    theme.play()
  }
}
