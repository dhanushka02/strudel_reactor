// src/components/NavbarControls.jsx

import React, {useRef} from 'react';
import { Play, Square, Wand2, Music2, Save, Upload } from 'lucide-react';


export default function NavbarControls({
        onProcess,
        onProcPlay,
        onPlay,
        onStop,
        isPlaying,
        onSavePresetFile,
        onLoadPresetFile,

})

{
    const fileInputRef = useRef(null);

    return (
        <nav className='navbar fixed-top px-4 py-3 header-container'>
            <div className='d-flex align-items-center gap-2'>
                <div className='logo-icon me-3'>
                    <Music2 size={24} className='text-accent' />
                </div>
                <div className=' d-flex flex-column'>
                    <h1 className='mb-0 h2'>Strudel Reactor</h1>
                    <small className='brand-subtitle mt-1'>Live Coding Music Platform</small>
                </div>
                
            </div>

            <div className='d-flex align-items-center gap-3'>
                <button id="play" type='button' className='btn btn-play position-relative' onClick={onPlay} disabled={isPlaying}>
                    <Play size={16} className='me-2' />
                    Play
                </button>
                <button id="stop" type='button' className='btn btn-stop position-relative ' onClick={onStop} disabled={!isPlaying}>
                    <Square size={16} className='me-2' />
                    Stop
                </button>
                <button id="process" type='button'  className='btn btn-proc position-relative' onClick={onProcess}>
                    <Wand2 size={16} className='me-2' />
                    Process
                </button>
                <button id="process-play" type='button' className='btn btn-procplay position-relative' onClick={onProcPlay} disabled={isPlaying}>
                    <Wand2 size={16} className='me-2' />
                    Process &amp; Play
                </button>
            </div>

            {/* Preset Controls */}
            <div className="d-flex align-items-center gap-2 nav-preset-group">
                <button
                    type="button"
                    className="btn nav-preset-btn"
                    onClick={() => onSavePresetFile && onSavePresetFile()}
                >
                    <Save size={24} className='text-accent' />
                    <span>Save Preset</span>
                </button>

                <button
                    type="button"
                    className="btn nav-preset-btn"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                    <Upload size={24} className='text-accent' />
                    <span>Load Preset</span>
                </button>

                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file && onLoadPresetFile) {
                        onLoadPresetFile(file);
                    }
                    e.target.value = "";
                    }}
                />
            </div>
        </nav>
    );
}
