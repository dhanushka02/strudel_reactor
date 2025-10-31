// src/components/NavbarControls.jsx
import React from 'react';

export default function NavbarControls() {
    return (
        <nav className='navbar fixed-top px-4 py-2 header-container'>
            <div className='d-flex align-items-center gap-2'>
                <h3 className='mb-0 fw-bold'>Strudel Reactor</h3>
                <small className='text-muted'>Live Coding Music Platform</small>
            </div>

            <div className='d-flex align-items-center gap-2'>
                <button id="process" type='button'  className='btn btn-secondary'>Process</button>
                <button id="process-play" type='button' className='btn btn-primary btn-sm'>Process &amp; Play</button>
                <button id="play" type='button' className='btn btn-success btn-sm'>Play</button>
                <button id="stop" type='button' className='btn btn-danger btn-sm'>Stop</button>
            </div>
        </nav>
    );
}
