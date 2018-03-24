import { Vector2 } from 'three'

export default {
  uniforms: {
    resolution: { type: 'v2', value: new Vector2(600, 600) },
    time: { type: 'f', value: 0 },
    tDiffuse: { type: 't', value: null }
  },
  fragmentShader: `
    // https://www.shadertoy.com/view/4lB3Dc

    uniform vec2 resolution;
    uniform float time;

    uniform sampler2D tDiffuse;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 samplePosition = gl_FragCoord.xy / resolution.xy;
      float t = time / 10000.0;

      samplePosition.x = samplePosition.x+(rand(vec2(t,gl_FragCoord.y))-0.5)/128.0;
      samplePosition.y = samplePosition.y+(rand(vec2(t))-0.5)/128.0;

      // Slightly add color noise to each line
      vec4 colourNoise = .1 * (
        vec4(-0.5) +
        vec4(
          rand(vec2(gl_FragCoord.y,t)),
          rand(vec2(gl_FragCoord.y,t+1.0)),
          rand(vec2(gl_FragCoord.y,t+2.0)),
          0
        )
      );

      // Either sample the texture, or just make the pixel white (to get the staticy-bit at the bottom)
      float whiteNoise = rand(
        vec2(t,0) + 
        vec2(
          floor(samplePosition.y * 30.0),
          floor(samplePosition.x * 30.0)
        )
      );

      bool useNoise = (
        whiteNoise > 11.5 - 30.0 * samplePosition.y ||
        whiteNoise < 1.5 - 5.0 * samplePosition.y
      );

      gl_FragColor = useNoise
        ? colourNoise + texture2D(tDiffuse,samplePosition)
        : vec4(1);
    }
  `
}
