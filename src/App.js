import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope, evaluate } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './assets/tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';


import NavbarControls from './components/NavbarControls';
import PreprocessorEditor from './components/PreprocessorEditor';
import OutputDisplay from './components/OutputDisplay';
import D3Visualizer from './components/D3Visualizer';
import ControlsPanel from './components/ControlsPanel';

let globalEditor = null;

function replEval(code) {
    const repl = globalEditor?.repl;
    if (!repl) return;

    if (typeof repl.evaluate === 'function') {
        return repl.evaluate(code);
    }

    // Fallback: append + evaluate
    const cur = typeof globalEditor.getCode === 'function' ? globalEditor.getCode() : '';
    globalEditor.setCode(`${cur}\n${code}`);
    return globalEditor.evaluate();
}

const handleD3Data = (event) => {
    console.log(event.detail);
};


export function SetupButtons() {

    const bind = () => {
        const playBtn = document.getElementById('play');
        const stopBtn = document.getElementById('stop');
        const procBtn = document.getElementById('process');
        const procPlayBtn = document.getElementById('process-play');

        if (!playBtn || !stopBtn || !procBtn || !procPlayBtn){
            requestAnimationFrame(bind);
            return;
        }

        playBtn.onclick = () => globalEditor?.evaluate();
        stopBtn.onclick = () => globalEditor?.stop();
        procBtn.onclick = () => {console.log("Process"); Proc(false);};
        procPlayBtn.onclick = () => {console.log("Process and Play"); Proc(true);};
    };

    requestAnimationFrame(bind);

}



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

if (typeof window !== 'undefined') {
    window.ProcAndPlay = ProcAndPlay;
}

export function Proc(
    doPlay = false,
    {
        speed = 1,
        volume = 0.75,
        melodyOn = true,
        drumsOn = true,
        chordsOn = true,
        bassOn = true,
        extraOn = true,
    } = {}) {

    if (!globalEditor) return;

    let proc_text = document.getElementById('proc')
    if (!proc_text?.value) return;

    globalEditor.setCode(proc_text.value);

    replEval(`
    globalThis.SPEED  = ${speed};
    globalThis.VOLUME = ${volume};

    globalThis.MELODY = ${melodyOn ? 1 : 0};
    globalThis.DRUMS  = ${drumsOn  ? 1 : 0};
    globalThis.CHORDS = ${chordsOn ? 1 : 0};
    globalThis.BASS   = ${bassOn   ? 1 : 0};
    globalThis.EXTRA  = ${extraOn  ? 1 : 0};


    setcps((105/60/4) * globalThis.SPEED);
    `);

    if (doPlay) setTimeout(() => globalEditor.evaluate(), 0);
}

export function ProcessText(match, ...args) {

    let replace = ""
    // if (document.getElementById('flexRadioDefault2').checked) {
    //     replace = "_"
    // }

    return replace
}

export default function StrudelDemo() {

const hasRun = useRef(false);
const [isPlaying, setIsPlaying] = useState(false);

const [volume, setVolume] = useState(0.75);
const [speed, setSpeed] = useState(1);

const [melodyVol, setMelodyVol] = useState(1);
const [drumsVol, setDrumsVol] = useState(1);
const [chordsVol, setChordsVol] = useState(1);
const [bassVol, setBassVol] = useState(1);
const [extraVol, setExtraVol] = useState(1);

const [melodyOn, setMelodyOn] = useState(true);
const [drumsOn,  setDrumsOn]  = useState(true);
const [chordsOn, setChordsOn] = useState(true);
const [bassOn,   setBassOn]   = useState(true);
const [extraOn,  setExtraOn]  = useState(true);


const BASE_CPS = 105/60/4;

const handleVolumeChange = (val) => {
    const n = Math.max(0, Math.min(1, Number(val)));
    setVolume(n);
    replEval(`globalThis.VOLUME = ${n}`);

    globalEditor?.evaluate();
};

const handleSpeedChange = (mult) => {
    setSpeed(mult);
    replEval(`
        globalThis.SPEED = ${mult};
        setcps(${BASE_CPS} * globalThis.SPEED);
    `);
};

const handleProcess = () => {
    if (isPlaying) return;
    Proc(false, { speed, volume, melodyOn, drumsOn, chordsOn, bassOn, extraOn });
};
const handleProcPlay = () => {
    if (isPlaying) return;
    Proc(true,  { speed, volume, melodyOn, drumsOn, chordsOn, bassOn, extraOn });
    setIsPlaying(true);
};

const handlePlay = () => {
    if (isPlaying) return;
    globalEditor?.evaluate();
    setIsPlaying(true);
};

const handleStop = () => {
    globalEditor?.stop();
    setIsPlaying(false);
}

// Live instruments toggling

const onMelody = (on) => {
    setMelodyOn(on);
    replEval(`globalThis.MELODY = ${on ? 1 : 0}`);
    if (isPlaying) globalEditor?.evaluate();
};

const onDrums = (on) => {
  setDrumsOn(on);
  replEval(`globalThis.DRUMS = ${on ? 1 : 0}`);
  if (isPlaying) globalEditor?.evaluate();
};

const onChords = (on) => {
    setChordsOn(on);
    replEval(`globalThis.CHORDS = ${on ? 1 : 0}`);
    if (isPlaying) globalEditor?.evaluate();
};

const onBass = (on) => {
    setBassOn(on);
    replEval(`globalThis.BASS = ${on ? 1 : 0}`);
    if (isPlaying) globalEditor?.evaluate();
};

const onExtra = (on) => {
    setExtraOn(on);
    replEval(`globalThis.EXTRA = ${on ? 1 : 0}`);
    if (isPlaying) globalEditor?.evaluate();
};

// Live instrument volume sliders

const makeVolHandler = (setter, globalName) => (val) => {
    const n = Math.max(0, Math.min(1, Number(val)));
    setter(n);
    replEval(`globalThis.${globalName} = ${n};`);
    if (isPlaying) {
        globalEditor?.evaluate();
    }
};

const handleMelodyVol = makeVolHandler(setMelodyVol, 'MELODY_VOL');
const handleDrumsVol  = makeVolHandler(setDrumsVol,  'DRUMS_VOL');
const handleChordsVol = makeVolHandler(setChordsVol, 'CHORDS_VOL');
const handleBassVol   = makeVolHandler(setBassVol,   'BASS_VOL');
const handleExtraVol  = makeVolHandler(setExtraVol,  'EXTRA_VOL');


useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps

            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio')
                        
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        const ta = document.getElementById('proc');
        if (ta) ta.value = stranger_tune;
        replEval(`globalThis.VOLUME = ${volume ?? 0.75};`);
        Proc(false);
        
    }

}, []);


return (
    <div className='App'>
        {/* Top Navbar */}
        <NavbarControls
            onProcess={handleProcess}
            onProcPlay={handleProcPlay}
            onPlay={handlePlay}
            onStop={handleStop}
            isPlaying={isPlaying}
        />

        {/* Main Content */}
        <div className="container-fluid px-4 py-3">
            {/* Left Column */}
            <div className='row gx-3 gy-3'>
                <div className='col-lg-8 col-md-12'>
                    <PreprocessorEditor />
                    <div className='mt-3'>
                        <OutputDisplay />
                    </div>
                </div>
                <div className='col-lg-4 col-md-12'>
                        <ControlsPanel

                        volume={volume} onVolume={handleVolumeChange}
                        speed={speed} onSpeed={handleSpeedChange}

                        melodyOn={melodyOn} onMelody={onMelody}
                        drumsOn={drumsOn} onDrums={onDrums}
                        chordsOn={chordsOn} onChords={onChords}
                        bassOn={bassOn} onBass={onBass}
                        extraOn={extraOn} onExtra={onExtra}

                        melodyVol={melodyVol} onMelodyVol={handleMelodyVol}
                        drumsVol={drumsVol}   onDrumsVol={handleDrumsVol}
                        chordsVol={chordsVol} onChordsVol={handleChordsVol}
                        bassVol={bassVol}     onBassVol={handleBassVol}
                        extraVol={extraVol}   onExtraVol={handleExtraVol}



                        />
                </div>
            </div>

            <div className='row gx-3 gy-3 mt-3'>
                <div className='col-12'>
                    <D3Visualizer />
                    <canvas id="roll" className='w-100 mt-2' height="200"></canvas>
                </div>
            </div>
        </div>
    </div>
    
);


}