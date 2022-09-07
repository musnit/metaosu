import React, { useEffect, useState, useRef } from 'react';
import run from '../metaosu';

const App = () => {

  const [blueness, setBlueness] = useState(1);
  const [sandbox, setSandbox] = useState(undefined);
  const [audioDuration, setAudioDuration] = useState(undefined);
  const [timeUpdate, setTimeUpdate] = useState(undefined);
  const audioRef = useRef()
  const notes = [2, 1, 4, 1, 6, 1];

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
    sandbox.setUniform('u_loopTime', audioDuration);
    sandbox.setUniform('u_notes', ...notes);
  }, [sandbox, audioDuration]);

  const processSeek =(target) => {
    if (!sandbox) {
      return;
    }
    const playTime = (performance.now() - sandbox.timeLoad) / 1000;
    sandbox.setUniform('u_playTime', playTime);
    sandbox.setUniform('u_startPoint', target.currentTime);
  }

  const processPlay =(target) => {
    if (!sandbox) {
      return;
    }
    processSeek(target);
    sandbox.setUniform('u_playing', 1);
  }

  const processPause =(target) => {
    if (!sandbox) {
      return;
    }
    processSeek(target);
    sandbox.setUniform('u_playing', 0);
  }

  return (
    <>
    <div id='canvas-wrapper'>
    </div>
    <div>
     Blueness: <input type="range" value={blueness} min="0" max="1" step="0.1" onChange={e=>setBlueness(parseFloat(e.target.value))}></input>
    </div>
    <audio autoPlay loop onEnded={()=>console.log('ended')} controls ref={audioRef} onPause={e=>processPause(e.target)} onPlay={e=>processPlay(e.target)} onSeeked={e=>processSeek(e.target)} onDurationChange={e=>setAudioDuration(e.target.duration)}>
      <source src="loop.mp3" type="audio/mpeg" />
    </audio>
    </>
  );
};

export default App;
