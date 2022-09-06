import './styles.css';

const vertexShaderSrc = `
attribute vec3 position;
attribute vec4 color;
varying vec4 fcolor;
void main(void) {
    gl_Position = vec4(position, 1);
    fcolor = color;
}
`;
const fragmentShaderSrc = `
precision mediump float;
varying vec4 fcolor;
void main(void) {
    gl_FragColor = fcolor;
}
`;
class Triangle {
constructor(gl) {
    this.gl = gl;
    this.vertexPositionBuffer = this.setVertices();
    this.vertexColorBuffer= this.setColors();
}
setVertices() {
    const triangleVertices = [
         1.0, -1.0, 0.0,
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    let triangleVertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);

    return triangleVertexPositionBuffer;
}
setColors() {
    const colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    let triangleVertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

    return triangleVertexColorBuffer;
}
}
class Playground {
constructor() {
    this.gl = this.createContext();

    this.vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
    this.fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);

    this.program = this.setProgram();
    this.triangle = new Triangle(this.gl);

    this.setAttributes();
    this.render();
}
createContext() {
  const container = document.getElementById('gl');
  const canvas = document.createElement('canvas');

  let screenHeight = window.innerHeight;
  let screenWidth = window.innerWidth;

  canvas.height = screenHeight;
  canvas.width = screenWidth;

  container.appendChild(canvas);

  return canvas.getContext('webgl');
}
setProgram() {
    let program = this.gl.createProgram();
    this.gl.attachShader(program, this.vertexShader);
    this.gl.attachShader(program, this.fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.log('Could not initialize shaders');
    }

    this.gl.useProgram(program);

    return program;
}
setAttributes() {
    let positionAttributeLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle.vertexPositionBuffer);
    this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);

    let colorAttributeLocation = this.gl.getAttribLocation(this.program, 'color');
    this.gl.enableVertexAttribArray(colorAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle.vertexColorBuffer);
    this.gl.vertexAttribPointer(colorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
}
compileShader(type, src) {
    const shader = this.gl.createShader(type);
    const trimSrc = src.trim();

    this.gl.shaderSource(shader, trimSrc);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.log(this.gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
render() {
    this.gl.clearColor(0,0,0,1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    requestAnimationFrame(this.render.bind(this));
}
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const canvas = document.createElement('canvas');
    canvas.id = 'main-canvas';
    document.body.appendChild(canvas);

    let playground = new Playground();
  }
}
