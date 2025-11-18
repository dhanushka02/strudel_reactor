/* global globalThis */

import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope, evaluate } from '@strudel/core';
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

        space = 0.6,
        bright = 0.5,
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

    globalThis.SPACE   = ${space};
    globalThis.BRIGHT  = ${bright};


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


const [space,  setSpace]  = useState(0.6);
const [bright, setBright] = useState(0.5);
const [width,  setWidth]  = useState(0.7);
const [chordLen, setChordLen] = useState(0.6);

const [drumKit, setDrumKit] = useState(0);
const [melodyStyle, setMelodyStyle] = useState(0);

const [section, setSection] = useState(0);

const [melodyOn, setMelodyOn] = useState(true);
const [drumsOn,  setDrumsOn]  = useState(true);
const [chordsOn, setChordsOn] = useState(true);
const [bassOn,   setBassOn]   = useState(true);
const [extraOn,  setExtraOn]  = useState(true);

const [presets, setPresets] = useState([]);
const [presetName, setPresetName] = useState("");



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

const handleWidthChange = (val) => {
    const n = Math.max(0, Math.min(1, Number(val)));
    setWidth(n);
    replEval(`globalThis.WIDTH = ${n};`);
    if (isPlaying) globalEditor?.evaluate();
};

const handleChordLen = (val) => {
    const n = Math.max(0, Math.min(1, Number(val)));
    setChordLen(n);
    replEval(`globalThis.CHORD_LEN = ${n};`);
    if (isPlaying) globalEditor?.evaluate();
};

const handleDrumKit = (kitIndex) => {
    setDrumKit(kitIndex);
    replEval(`globalThis.DRUM_KIT = ${kitIndex};`);
    if (isPlaying) {
        globalEditor?.evaluate();
    }
};

const handleMelodyStyle = (styleIndex) => {
    setMelodyStyle(styleIndex);
    replEval(`globalThis.MELODY_STYLE = ${styleIndex};`);
    if (isPlaying) {
        globalEditor?.evaluate();
    }
};

const handleProcess = () => {
    if (isPlaying) return;
    Proc(false, { speed, volume, melodyOn, drumsOn, chordsOn, bassOn, extraOn, space, bright });
};
const handleProcPlay = () => {
    if (isPlaying) return;
    Proc(true,  { speed, volume, melodyOn, drumsOn, chordsOn, bassOn, extraOn, space, bright });
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

// FX hanldlers
const clamp01 = (v) => Math.max(0, Math.min(1, Number(v)));

const onSpace = (val) => {
    const n = clamp01(val);
    setSpace(n);
    replEval(`globalThis.SPACE = ${n};`);
    if (isPlaying) globalEditor?.evaluate();
};

const onBright = (val) => {
    const n = clamp01(val);
    setBright(n);
    replEval(`globalThis.BRIGHT = ${n};`);
    if (isPlaying) globalEditor?.evaluate();
};

const onSection = (val) => {
    setSection(val);
    replEval(`globalThis.SECTION = ${val};`);
    if (isPlaying) globalEditor?.evaluate();
};

const handleD3Data = (event) => {
    console.log("[d3Data]", event.detail);
};

// Helper to build preset object from current settings
const buildPresetObject = () => ({
    version: 1,
    createdAt: Date.now(),
    settings: {
        volume,
        speed,
        space,
        bright,
        width,
        chordLen,
        drumKit,
        melodyStyle,
        section,
        melodyOn,
        drumsOn,
        chordsOn,
        bassOn,
        extraOn,
    },
});

// Save → download a .json file
const handleSavePresetFile = () => {
    const preset = buildPresetObject();
    const json = JSON.stringify(preset, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "strudel-preset.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

// Apply loaded JSON to React state + Strudel globals
const applyPresetSettings = (raw) => {

    const s = raw.settings || raw;

    // 1) Update React state
    setVolume(s.volume ?? 0.75);
    setSpeed(s.speed ?? 1);
    setSpace(s.space ?? 0.6);
    setBright(s.bright ?? 0.5);
    setWidth(s.width ?? 0.7);
    setChordLen(s.chordLen ?? 0.6);
    setDrumKit(s.drumKit ?? 0);
    setMelodyStyle(s.melodyStyle ?? 0);
    setSection(s.section ?? 0);

    setMelodyOn(!!s.melodyOn);
    setDrumsOn(!!s.drumsOn);
    setChordsOn(!!s.chordsOn);
    setBassOn(!!s.bassOn);
    setExtraOn(!!s.extraOn);

    // 2) Push into Strudel globals
    replEval(`
        globalThis.VOLUME = ${s.volume ?? 0.75};
        globalThis.SPEED  = ${s.speed ?? 1};

        globalThis.MELODY = ${s.melodyOn ? 1 : 0};
        globalThis.DRUMS  = ${s.drumsOn ? 1 : 0};
        globalThis.CHORDS = ${s.chordsOn ? 1 : 0};
        globalThis.BASS   = ${s.bassOn ? 1 : 0};
        globalThis.EXTRA  = ${s.extraOn ? 1 : 0};

        globalThis.SPACE      = ${s.space ?? 0.6};
        globalThis.BRIGHT     = ${s.bright ?? 0.5};
        globalThis.WIDTH      = ${s.width ?? 0.7};
        globalThis.CHORD_LEN  = ${s.chordLen ?? 0.6};

        globalThis.DRUM_KIT     = ${s.drumKit ?? 0};
        globalThis.MELODY_STYLE = ${s.melodyStyle ?? 0};
        globalThis.SECTION      = ${s.section ?? 0};

        setcps(${BASE_CPS} * globalThis.SPEED);
    `);

    // 3) Re-process the tune with new settings
    Proc(false, {
        speed: s.speed ?? 1,
        volume: s.volume ?? 0.75,
        melodyOn: !!s.melodyOn,
        drumsOn: !!s.drumsOn,
        chordsOn: !!s.chordsOn,
        bassOn: !!s.bassOn,
        extraOn: !!s.extraOn,
        space: s.space ?? 0.6,
        bright: s.bright ?? 0.5,
    });

    if (isPlaying) {
        globalEditor?.evaluate();
    }
};

// Load - user picks a .json file, then parse and apply
const handleLoadPresetFile = async (file) => {
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text); // JSON READ
        applyPresetSettings(data);
        console.log("[preset] loaded from file:", data);
    } catch (err) {
        console.error("[preset] failed to load file", err);
        alert("Could not load preset file. Make sure it is valid JSON.");
    }
};

// Load presets (JSON) from localStorage
useEffect(() => {
    try {
        const raw = localStorage.getItem("strudel_presets_v1");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            setPresets(parsed);
        }
    } catch (err) {
        console.warn("[presets] failed to load from localStorage", err);
    }
}, []);

useEffect(() => {

    if (!hasRun.current) {
        window.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById('editor'),

            // We still use onDraw just to emit data for our custom D3 graph
            onDraw: (haps, time) => {
                if (typeof window === "undefined") return;

                const nowSecs = performance.now() / 1000;

                haps.forEach((h) => {
                    const v = h.value ?? {};
                    const sName = v.s ?? v.sound ?? v.sample ?? "";
                    if (!sName) return;

                    let instrument = null;

                    if (/^(bd|sd|hh|cp|rim)/.test(sName)) {
                        instrument = "drums";
                    } else if (/^gm_kalimba/.test(sName) || /^gm_acoustic_guitar_steel/.test(sName)) {
                        instrument = "melody";
                    } else if (/^gm_epiano1/.test(sName)) {
                        instrument = "chords";
                    } else if (/^gm_electric_guitar_jazz/.test(sName)) {
                        instrument = "extra";
                    } else if (/^gm_lead_8_bass_lead/.test(sName) || /^gm_electric_bass_pick/.test(sName)) {
                        instrument = "bass";
                    }

                    if (!instrument) return;

                    const velocity = v.velocity ?? v.vel ?? 1;
                    const note = v.note ?? null;

                    window.dispatchEvent(
                        new CustomEvent("d3Data", {
                            detail: {
                                instrument,
                                velocity,
                                time: nowSecs,
                                note,
                            },
                        })
                    );
                });
            },

            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import("@strudel/core"),
                    import("@strudel/draw"),
                    import("@strudel/mini"),
                    import("@strudel/tonal"),
                    import("@strudel/webaudio")
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            },
        });
            
        const ta = document.getElementById('proc');
        if (ta) ta.value = stranger_tune;
        replEval(`
            globalThis.VOLUME = ${volume ?? 0.75};
            globalThis.WIDTH = ${width ?? 0.7};
            globalThis.MELODY_STYLE = ${melodyStyle};
            `);
        Proc(false, { speed, volume, melodyOn, drumsOn, chordsOn, bassOn, extraOn, space, bright });
    return () => {
        window.removeEventListener("d3Data", handleD3Data);
            globalEditor?.stop();
    }
        
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
        onSavePresetFile={handleSavePresetFile}
        onLoadPresetFile={handleLoadPresetFile}
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

                        space={space} onSpace={onSpace}
                        bright={bright} onBright={onBright}
                        width={width} onWidth={handleWidthChange}
                        chordLen={chordLen} onChordLen={handleChordLen}

                        drumKit={drumKit} onDrumKit={handleDrumKit}
                        melodyStyle={melodyStyle} onMelodyStyle={handleMelodyStyle}

                        section={section} onSection={onSection}


                        />
                </div>
            </div>

            <div className='row gx-3 gy-3 mt-3'>
                <div className='col-12'>
                    <D3Visualizer />
                </div>
            </div>
        </div>
    </div>
    
);


}