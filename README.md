# Keyboard Presentation

I put together a presentation (early/mid 2018?), using WebGL because I like to
be fancy, to share a side project: building an ergonomic keyboard.

Going through it on your own now isn't the same as when I presented it live but
if you're looking at this now it's because I wanted to show you some of the cool
technical aspects of this presentation:

- data-driven 3D rendering of keyboard layouts using three.js
- "slideshow engine" inspired by reveal.js, but focusing on events that I can
  use for programmatic transitions
- tweening key positions/orientations between radically different keyboard
  layouts
- Mixing HTML/WebGL with an On Screen Ruler: hold any two keys on a slide that's
  displaying a keyboard layout and see how far apart those keys are.

[Keyboard Presentation](https://nickcoutsos.github.io/keyboard-presentation/) on
github pages. Advance slides with arrow keys. You'll know when you're done.

## See also

- [Dactyl keyboard](https://github.com/adereth/dactyl-keyboard/): the ergonomic
  keyboard I based my design on (didn't create this myself)
- [dactyl-flatpacked](https://github.com/nickcoutsos/dactyl-flatpacked): my
  version; I re-wrote the Dactyl in OpenSCAD staying true to the "spec" that
  defines key placement, but the output is a collection of 2D shapes that would
  be used as a laser cutting template. These pieces slot together to create the
  same keyboard.
