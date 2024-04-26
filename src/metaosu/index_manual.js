import digits from './digits.frag';
import vertex from './vertex.vert';

const compileShader = (gl, type, src) => {
  const shader = gl.createShader(type);
  const trimSrc = src.trim();

  gl.shaderSource(shader, trimSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      return null;
  }

  return shader;
}

const setCanvasSize = (canvas) => {
  let screenHeight = window.innerHeight;
  let screenWidth = window.innerWidth;

  canvas.height = screenHeight;
  canvas.width = screenWidth;
}

const createCanvas = () => {
  const container = document.getElementById('canvas-wrapper');
  const canvas = document.createElement('canvas');

  setCanvasSize(canvas);

  container.appendChild(canvas);
  return canvas;
}

const setProgram = (gl, vertexShader, fragmentShader) => {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Could not initialize shaders');
    }

    gl.useProgram(program);

    return program;
}

const render = (gl, program, canvas, startTimestamp, currentTimestamp) => {
  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  setTimeUniform(gl, program, startTimestamp, currentTimestamp);
  requestAnimationFrame((currentTimestamp) => render(gl, program, canvas, startTimestamp, currentTimestamp));
}

const defineVertexBuffer = (gl, program) => {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verticesAndTexCoords = [-1.0, -1.0, 0.0, 0.0, 1.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 1.0, 0.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesAndTexCoords), gl.STATIC_DRAW);
    let stride = 4 * Float32Array.BYTES_PER_ELEMENT;
    let posLocation = gl.getAttribLocation(program, 'a_position');
    let texLocation = gl.getAttribLocation(program, 'a_texcoord');
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(posLocation);
    gl.enableVertexAttribArray(texLocation);
}

const setResolutionUniform = (gl, program, canvas) => {
  const location  = gl.getUniformLocation(program, 'u_resolution');
  gl.uniform2f(location, canvas.width, canvas.height);
}

const setTimeUniform = (gl, program, startTimestamp, currentTimestamp) => {
  const timePassed = currentTimestamp - startTimestamp;
  const location  = gl.getUniformLocation(program, 'u_time');
  gl.uniform1f(location, timePassed);
}

const run = () => {
  const canvas = createCanvas();
  const gl = canvas.getContext('webgl');

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, digits);

  const program = setProgram(gl, vertexShader, fragmentShader);
  defineVertexBuffer(gl, program);
  setResolutionUniform(gl, program, canvas);

  const startTime = performance.now();
  render(gl, program, canvas, startTime, startTime);

  window.onresize = () => {
    setCanvasSize(canvas);
    setResolutionUniform(gl, program, canvas);
  };

}


export default run;
