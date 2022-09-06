import './styles.css';
import run from './metaosu';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const canvasWrapper = document.createElement('div');
    canvasWrapper.id = 'canvas-wrapper';
    document.body.appendChild(canvasWrapper);

    run();
  }
}
