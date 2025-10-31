// src/components/NavbarControls.jsx
import React from 'react';
import { Play, Square, Wand2 } from 'lucide-react';

export default function NavbarControls() {
    return (
        <nav className='navbar fixed-top px-4 py-2 header-container'>
            <div className='d-flex align-items-center gap-2'>
                <h3 className='mb-0 fw-bold'>Strudel Reactor</h3>
                <small className='text-muted'>Live Coding Music Platform</small>
            </div>

            <div className='d-flex align-items-center gap-3'>
                <button id="process" type='button'  className='btn btn-slate btn-sm rounded-3 shadow-sm'>
                    <Wand2 size={16} className='me-2' />
                    Process
                </button>
                <button id="process-play" type='button' className='btn btn-ghost-accent btn-sm rounded-3 shadow-sm'>
                    <Wand2 size={16} className='me-2' />
                    Process &amp; Play
                </button>
                <button id="play" type='button' className='btn btn-success-dark btn-sm rounded-3 shadow-sm'>
                    <Play size={16} className='me-2' />
                    Play
                </button>
                <button id="stop" type='button' className='btn btn-danger-dark btn-sm rounded-3 shadow-sm'>
                    <Square size={16} className='me-2' />
                    Stop
                </button>
            </div>
        </nav>
    );
}
