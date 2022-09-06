import digits from './digits.frag';
import GlslCanvas from 'glslCanvas';

const createCanvas = () => {
  const container = document.getElementById('canvas-wrapper');
  const canvas = document.createElement('canvas');

  setCanvasSize(canvas);

  container.appendChild(canvas);
  return canvas;
}

const setCanvasSize = (canvas) => {
  let screenHeight = window.innerHeight;
  let screenWidth = window.innerWidth;

  canvas.height = screenHeight;
  canvas.width = screenWidth;
}

const run = () => {
  const canvas = createCanvas();
  const sandbox = new GlslCanvas(canvas);
  sandbox.load(digits);
}

export default run;
