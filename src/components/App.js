import React, { useEffect, useState, useRef } from 'react';
import run from '../metaosu';

const App = () => {

  const [noteIntensity, setNoteIntensity] = useState(1);
  const [sandbox, setSandbox] = useState(undefined);
  const [audioDuration, setAudioDuration] = useState(undefined);
  const [activeInput, setActiveInput] = useState(false);

  const audioRef = useRef()

  const notes = [
    2, 1, 0,
    4, 1, 1,
    6, 1, 2,
    7, 1, 0,
    8, 1, 1,
    9, 2, 2,
    10, 3, 0,
  ];

  useEffect(() => {
    const sandbox = run();
    setSandbox(sandbox);
    console.log('Sandbox started');
  }, []);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_note_intensity', noteIntensity);
  }, [sandbox, noteIntensity]);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_activeInput', activeInput? 1 : 0);
  }, [sandbox, activeInput]);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_loopTime', audioDuration);
    sandbox.setUniform('u_notes', ...notes);
    sandbox.setUniform('u_noteCount', parseFloat(notes.length));
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
    <div onMouseDown={e=>setActiveInput(true)} onMouseUp={e=>setActiveInput(false)} id='canvas-wrapper'>
    </div>
    <div>
     Note Intensity: <input type="range" value={noteIntensity} min="0" max="1" step="0.1" onChange={e=>setNoteIntensity(parseFloat(e.target.value))}></input>
    </div>
    <audio autoPlay loop onEnded={()=>console.log('ended')} controls ref={audioRef} onPause={e=>processPause(e.target)} onPlay={e=>processPlay(e.target)} onSeeked={e=>processSeek(e.target)} onDurationChange={e=>setAudioDuration(e.target.duration)}>
      <source src="loop.mp3" type="audio/mpeg" />
    </audio>
    </>
  );
};

export default App;
