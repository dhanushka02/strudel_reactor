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
                <button id="process" className='btn btn-outline-secondary'>Process</button>
                <button id="process-play" className='btn btn-primary btn-sm'>Proc &amp; Play</button>
                <button id="play" className='btn btn-outline-success btn-sm'>Play</button>
                <button id="stop" className='btn btn-outline-danger btn-sm'>Stop</button>
            </div>
        </nav>
    );
}
