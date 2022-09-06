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
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  setTimeUniform(gl, program, startTimestamp, currentTimestamp);
  requestAnimationFrame((currentTimestamp) => render(gl, program, canvas, startTimestamp, currentTimestamp));
}

const defineVertexBuffer = (gl, program) => {
    let texCoordsLoc = gl.getAttribLocation(program, 'a_texcoord');
    const texCoords = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoords);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordsLoc);
    gl.vertexAttribPointer(texCoordsLoc, 2, gl.FLOAT, false, 0, 0);

    let verticesLoc = gl.getAttribLocation(program, 'a_position');
    const vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(verticesLoc);
    gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0);
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
