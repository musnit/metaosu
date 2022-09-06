attribute vec3 position;
attribute vec4 color;
varying vec4 fcolor;

void main(void) {
    gl_Position = vec4(position, 1);
    fcolor = color;
}
