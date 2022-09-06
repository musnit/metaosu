import React, { useEffect } from 'react';
import run from '../metaosu';

const App = () => {

    useEffect(() => {
      run();
    });

  return (
    <div id='canvas-wrapper'>
    </div>
  );
};

export default App;
