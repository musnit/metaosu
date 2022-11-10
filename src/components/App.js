import React, { useEffect, useState, useRef } from 'react';
import run from '../metaosu';

const App = () => {

  const [noteIntensity, setNoteIntensity] = useState(1);
  const [startPoint, setStartPoint] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [playing, setPlaying] = useState(false);
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

  const setArrayUniform = (sandbox, name, array) => {
    // Add a suffix to ensure array length always > 4 so that
    // the sandbox library always sends an array rather than a
    // vec2/3/4
    sandbox.setUniform(name, ...array, ...[0,0,0,0]);
  }

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_mouseDownCount', parseFloat(mouseDowns.length));
    setArrayUniform(sandbox, 'u_mouseDowns', mouseDowns);
  }, [sandbox, mouseDowns.length]);

  useEffect(() => {
    if (!sandbox) {
      return;
    }
    sandbox.setUniform('u_mouseUpCount', parseFloat(mouseUps.length));
    setArrayUniform(sandbox, 'u_mouseUps', mouseUps);
  }, [sandbox, mouseUps.length]);

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

  const secondsPassed = () => (performance.now() - sandbox.timeLoad) / 1000;

  const calcGameTime = (time) => {
    if (playing) {
      return startPoint + ((secondsPassed() - playTime) % audioDuration);
    } else {
      return startPoint;
    }
  }

  const processSeek = (target) => {
    if (!sandbox) {
      return;
    }
    const time = secondsPassed();
    sandbox.setUniform('u_playTime', time);
    setPlayTime(time);
    setStartPoint(target.currentTime);
    sandbox.setUniform('u_startPoint', target.currentTime);
  }

  const processPlay =(target) => {
    if (!sandbox) {
      return;
    }
    processSeek(target);
    setPlaying(true);
    sandbox.setUniform('u_playing', 1);
  }

  const processPause =(target) => {
    if (!sandbox) {
      return;
    }
    processSeek(target);
    setPlaying(false);
    sandbox.setUniform('u_playing', 0);
  }

  const addMouseDown = () => {
    setActiveInput(true);
    const gameTime = calcGameTime(secondsPassed());
    setMouseDowns(mouseDowns.concat(gameTime));
  }

  const addMouseUp = () => {
    setActiveInput(false);
    const gameTime = calcGameTime(secondsPassed());
    setMouseUps(mouseUps.concat(gameTime));
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
    <audio
      autoPlay
      loop
      onEnded={()=>console.log('ended')}
      controls
      ref={audioRef}
      onPause={e=>processPause(e.target)}
      onPlay={e=>processPlay(e.target)}
      onSeeked={e=>processSeek(e.target)}
      onDurationChange={e=>setAudioDuration(e.target.duration)}>
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
