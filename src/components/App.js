import React, { useEffect, useState } from 'react';
import run from '../metaosu';

const App = () => {

  const [blueness, setBlueness] = useState(1);
  const [sandbox, setSandbox] = useState(undefined);

  useEffect(() => {
    const sandbox = run();
    setSandbox(sandbox);
    console.log('Sandbox started');
  }, []);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_blueness', blueness);
  }, [sandbox, blueness]);

  return (
    <>
    <div id='canvas-wrapper'>
    </div>
    <div>
     Blueness: <input type="range" value={blueness} min="0" max="1" step="0.1" onChange={e=>setBlueness(parseFloat(e.target.value))}></input>
    </div>
    </>
  );
};

export default App;
