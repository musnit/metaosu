import React, { useEffect, useState, useRef } from 'react';
import run from '../metaosu';

const App = () => {

  const [noteIntensity, setNoteIntensity] = useState(1);
  const [sandbox, setSandbox] = useState(undefined);
  const [audioDuration, setAudioDuration] = useState(undefined);
  const [activeInput, setActiveInput] = useState(false);
  const [mouseDowns, setMouseDowns] = useState([]);
  const [mouseUps, setMouseUps] = useState([]);

  const audioRef = useRef()

  // format is startTime, duration, lane (color)
  const notes = [
    1, 1, 0,
    1, 1, 1,
    1, 1, 2,
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
    sandbox.setUniform('u_mouseDowns', ...mouseDowns);
    sandbox.setUniform('u_mouseDownCount', parseFloat(mouseDowns.length));
  }, [sandbox, mouseDowns]);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_mouseUps', ...mouseUps);
    sandbox.setUniform('u_mouseUpCount', parseFloat(mouseUps.length));
  }, [sandbox, mouseUps]);

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

  const playTime = () => (performance.now() - sandbox.timeLoad) / 1000;

  const processSeek =(target) => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_playTime', playTime());
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

  const addMouseDown = () => {
    setActiveInput(true);
    setMouseDowns(mouseDowns.concat(playTime()));
  }

  const addMouseUp = () => {
    setActiveInput(false);
    setMouseUps(mouseUps.concat(playTime()));
  }

  const clearInputs = () => {
    setActiveInput(false);
    setMouseDowns([]);
    setMouseUps([]);
  }

  return (
    <>
    <div
      onMouseDown={addMouseDown}
      onMouseUp={addMouseUp}
    id='canvas-wrapper'>
    </div>
    <div>
     Note Intensity: <input type="range" value={noteIntensity} min="0" max="1" step="0.1" onChange={e=>setNoteIntensity(parseFloat(e.target.value))}></input>
    </div>
    <audio autoPlay loop onEnded={()=>console.log('ended')} controls ref={audioRef} onPause={e=>processPause(e.target)} onPlay={e=>processPlay(e.target)} onSeeked={e=>processSeek(e.target)} onDurationChange={e=>setAudioDuration(e.target.duration)}>
      <source src="loop.mp3" type="audio/mpeg" />
    </audio>
    <div>
    Mousedowns: {JSON.stringify(mouseDowns)}
    </div>
    <div>
    Mouseups: {JSON.stringify(mouseUps)}
    </div>
    <button onClick={clearInputs}>Clear Inputs</button>
    </>
  );
};

export default App;
