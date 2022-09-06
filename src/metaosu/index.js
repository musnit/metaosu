import digits from './digits.frag';
import GlslCanvas from 'glslCanvas';

const createCanvas = () => {
  const container = document.getElementById('canvas-wrapper');
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = '400' * window.devicePixelRatio;

  container.appendChild(canvas);
  return canvas;
}

const run = () => {
  const canvas = createCanvas();
  const sandbox = new GlslCanvas(canvas);
  sandbox.load(digits);
}

export default run;
