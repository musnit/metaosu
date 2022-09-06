function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Hello';

  return element;
}

document.body.appendChild(component());

// var vert = `
// attribute vec4 a_position;
// varying vec4 v_color;

// void main() {
//   gl_Position = vec4(a_position.xy, 0.0, 1.0);
//   v_color = gl_Position * 0.5 + 0.5;
// }
// `;
// var frag = `
// precision mediump float;

// varying vec4 v_color;

// uniform float time;

// void main() {
//   gl_FragColor = vec4(fract(v_color.rgb + time), 1);
// }
// `;

// var gl = document.getElementById("canvas").getContext('webgl');
// var vertexShader = createShader(gl, gl.VERTEX_SHADER, window.vert);
// var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, window.frag);
// var program = createProgram(gl, vertexShader, fragmentShader);
// const timeLocation = gl.getUniformLocation(program, "time");
// var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
// var positionBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// var positions = [
//   -1, -1,
//   -1, 1,
//   1, 1,
//   1, 1,
//   1, -1,
//   -1, -1,
// ];
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// function render(time) {
//   resizeCanvas(gl);
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//   gl.clearColor(0, 0, 0, 0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   gl.useProgram(program);
//   gl.enableVertexAttribArray(positionAttributeLocation);
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   // // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
//   var size = 2;          // 2 components per iteration
//   var type = gl.FLOAT;   // the data is 32bit floats
//   var normalize = false; // don't normalize the data
//   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
//   var offset = 0;        // start at the beginning of the buffer
//   gl.vertexAttribPointer(
//       positionAttributeLocation, size, type, normalize, stride, offset)

//   gl.uniform1f(timeLocation, time * 0.001);
//   // // draw
//   var primitiveType = gl.TRIANGLES;
//   var offset = 0;
//   var count = 6;
//   gl.drawArrays(primitiveType, offset, count);

//   requestAnimationFrame(render);
// }
// requestAnimationFrame(render);

// function resizeCanvas(gl) {
//   // not important for example
// }

// function createProgram(gl, vs, fs) {
//   const p = gl.createProgram();
//   gl.attachShader(p, vs);
//   gl.attachShader(p, fs);
//   gl.linkProgram(p);
//   // should check for error here!
//   return p;
// }

// function createShader(gl, type, src) {
//   const s = gl.createShader(type);
//   gl.shaderSource(s, src);
//   gl.compileShader(s);
//   // should check for error here
//   return s;
// }
