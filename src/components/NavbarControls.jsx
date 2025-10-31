// src/components/NavbarControls.jsx
import React from 'react';
import { Play, Square, Wand2, Music2 } from 'lucide-react';

export default function NavbarControls() {
    return (
        <nav className='navbar fixed-top px-4 py-3 header-container'>
            <div className='d-flex align-items-center gap-2'>
                <div className='logo-icon me-3'>
                    <Music2 size={24} className='text-accent' />
                </div>
                <div className=' d-flex flex-column'>
                    <h1 className='mb-0 h3'>Strudel Reactor</h1>
                    <small className='text-muted brand-subtitle mt-1'>Live Coding Music Platform</small>
                </div>
                
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
