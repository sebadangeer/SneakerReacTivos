import { useEffect, useRef } from 'react'

const vertexSource = `
attribute vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}`

const fragmentSource = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float xScale;
uniform float yScale;
uniform float distortion;
void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float d = length(p) * distortion;
  float rx = p.x * (1.0 + d);
  float gx = p.x;
  float bx = p.x * (1.0 - d);
  float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
  float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
  float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
  gl_FragColor = vec4(r, g, b, 1.0);
}`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function WebglBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { alpha: true, antialias: false })
    if (!canvas || !gl) return undefined

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertexShader || !fragmentShader) return undefined

    const program = gl.createProgram()
    if (!program) return undefined
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    const xScale = gl.getUniformLocation(program, 'xScale')
    const yScale = gl.getUniformLocation(program, 'yScale')
    const distortion = gl.getUniformLocation(program, 'distortion')
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    let frameId
    const render = (now) => {
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, now * 0.001)
      gl.uniform1f(xScale, 2.5)
      gl.uniform1f(yScale, 0.15)
      gl.uniform1f(distortion, 0.05)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      frameId = window.requestAnimationFrame(render)
    }
    resize()
    window.addEventListener('resize', resize)
    frameId = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frameId)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return <canvas id="webgl-canvas" ref={canvasRef} aria-hidden="true" />
}
