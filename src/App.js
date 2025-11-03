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

export function Proc(doPlay = false) {

    if (!globalEditor) return;

    let proc_text = document.getElementById('proc').value
    if (!proc_text) return;

    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)

    if (doPlay) setTimeout(() => globalEditor.evaluate(), 0);
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export default function StrudelDemo() {

const hasRun = useRef(false);
const [isPlaying, setIsPlaying] = useState(false);

const handleProcess = () => {
    if (isPlaying) return;
    Proc(false);
}

const handleProcPlay = () => {
    if (isPlaying) return;
    Proc(true);
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
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        const ta = document.getElementById('proc');
        if (ta) ta.value = stranger_tune;
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
                        <ControlsPanel disabled={isPlaying} />
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