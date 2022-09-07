import React, { useEffect, useState, useRef } from 'react';
import run from '../metaosu';

const App = () => {

  const [blueness, setBlueness] = useState(1);
  const [sandbox, setSandbox] = useState(undefined);
  const [audioDuration, setAudioDuration] = useState(undefined);
  const [timeUpdate, setTimeUpdate] = useState(undefined);
  const audioRef = useRef()

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

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    console.log({audioDuration})
    sandbox.setUniform('u_loopTime', audioDuration);
  }, [sandbox, audioDuration]);

  const processSeek =(currentTime) => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_seekTime', currentTime);
  }

  return (
    <>
    <div id='canvas-wrapper'>
    </div>
    <div>
     Blueness: <input type="range" value={blueness} min="0" max="1" step="0.1" onChange={e=>setBlueness(parseFloat(e.target.value))}></input>
    </div>
    <audio controls ref={audioRef} onSeeked={e=>processSeek(e.target.currentTime)} onDurationChange={e=>setAudioDuration(e.target.duration)}>
      <source src="dist/loop.mp3" type="audio/mpeg" />
    </audio>
    </>
  );
};

export default App;
