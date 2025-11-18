// src/components/ControlsPanel.jsx

import { useEffect, useState } from "react";

const speeds = [0.5, 1, 1.5, 2];

export default function ControlsPanel(
    {
        disabled = false,
        volume, onVolume,
        speed, onSpeed,

        // Instrument toggles //
        melodyOn, onMelody,
        drumsOn, onDrums,
        chordsOn, onChords,
        bassOn, onBass,
        extraOn, onExtra,
        
        // FX
        space, onSpace,
        bright, onBright,
        width, onWidth,
        chordLen, onChordLen,

        drumKit, onDrumKit,
        melodyStyle, onMelodyStyle,
        section, onSection,
        
    }) {
        const [activeTab, setActiveTab] = useState('instruments');

        const instruments = [
            { id: "melody", label: "Melody (Kalimba / Guitar)", checked: melodyOn, onChange: onMelody },
            { id: "drums",  label: "Drums",                      checked: drumsOn,  onChange: onDrums },
            { id: "chords", label: "Chords (E-Piano)",           checked: chordsOn, onChange: onChords },
            { id: "bass",   label: "Bass",                        checked: bassOn,   onChange: onBass },
            { id: "extra",  label: "Extra (Organ + Arp)",        checked: extraOn,  onChange: onExtra },
    ];

        const drumKits = [
            { id: 0, value: 0, label: "Studio" },
            { id: 1, value: 1, label: "TR-808" },
            { id: 2, value: 2, label: "TR-909" },
    ];

        const melodyStyles = [
            { id: 0, label: "Soft Kalimba" },
            { id: 1, label: "Kalimba + Guitar" },
            { id: 2, label: "E-Piano Lead" },
    ];

    
    
    return (

            <aside className={`cp-card p-3 ${disabled ? 'cp-disabled' : ''}`}>
                <h5 className="cp-title m-0">Controls Panel</h5>
                <small>Real-time control over the Strudel REPL</small>
                <div className="d-flex align-items-center justify-content-between mb-3 mt-3">
                    

                    {/* Segmented Tabs */}
                    <div className="cp-tabs" role="tablist" aria-label="Control Tabs">
                        <button className="cp-tab" role="tab" aria-selected={activeTab === 'instruments'} onClick={() => setActiveTab('instruments')}>Instruments</button>
                        <button className="cp-tab" role="tab" aria-selected={activeTab === 'effects'} onClick={() => setActiveTab('effects')}>Effects</button>
                        <button className="cp-tab" role="tab" aria-selected={activeTab === 'kits'} onClick={() => setActiveTab('kits')}>Kits</button>
                        <button className="cp-tab" role="tab" aria-selected={activeTab === 'sections'} onClick={() => setActiveTab('sections')}>Sections</button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'instruments' && (
                    <section className="cp-pattern mb-3">
                            <h6 className="mb-2">Instruments</h6>

                            <div className="d-grid gap-2">
                            {instruments.map(({ id, label, checked, onChange }) => (
                                <label key={id} className="cp-toggle-row">
                                <span className="cp-toggle-label">{label}</span>
                                <input
                                    id={`ins-${id}`}
                                    type="checkbox"
                                    className="cp-toggle-input"
                                    checked={!!checked}
                                    onChange={(e) => onChange?.(e.target.checked)}
                                    aria-label={`${label} ${checked ? "on" : "off"}`}
                                />
                                <span className="cp-toggle-switch" aria-hidden />
                                </label>
                            ))}
                            </div>
                    </section>
                )}

                {activeTab === 'effects' && (
                    <section className="cp-pattern mb-3">
                            <h6 className="mb-3">Effects</h6>

                            {/* Space / Reverb */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                <label className="fw-semibold m-0">Space (Reverb)</label>
                                <span className="cp-value-badge">
                                    {Math.round((space ?? 0) * 100)}%
                                </span>
                                </div>
                                <input
                                className="cp-range"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={space}
                                onChange={(e) => onSpace?.(Number(e.target.value))}
                                />
                            </div>

                            {/* Brightness */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                <label className="fw-semibold m-0">Brightness</label>
                                <span className="cp-value-badge">
                                    {Math.round((bright ?? 0) * 100)}%
                                </span>
                                </div>
                                <input
                                className="cp-range"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={bright}
                                onChange={(e) => onBright?.(Number(e.target.value))}
                                />
                            </div>

                            {/* Stereo Width */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="fw-semibold m-0">Stereo Width</label>
                                    <span className="cp-value-badge">
                                    {Math.round((width ?? 0) * 100)}%
                                    </span>
                                </div>
                                <input
                                    className="cp-range"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={width}
                                    onChange={e => onWidth?.(Number(e.target.value))}
                                />
                            </div>

                            {/* Chord Length */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="fw-semibold m-0">Chord Length</label>
                                    <span className="cp-value-badge">
                                    {Math.round((chordLen ?? 0) * 100)}%
                                    </span>
                                </div>
                                <input
                                    className="cp-range"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={chordLen}
                                    onChange={e => onChordLen?.(Number(e.target.value))}
                                />
                            </div>
                    </section>
                )}
                {activeTab === 'kits' && (
                    <section className="cp-pattern mb-3">
                        <h6 className="mb-3">Kits</h6>

                        {/* Drum kit selector */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="fw-semibold m-0">Drum Kit</label>
                            </div>
                            <div className="speed-toggle" role="group" aria-label="Drum Kit Selector">
                            {drumKits.map(k => {
                                const active = drumKit === k.value;
                                const inputId = `kit-${k.id}`;
                                return (
                                <div key={k.id} className="speed-item">
                                    <input
                                    id={inputId}
                                    type="radio"
                                    name="drumKit"
                                    className="vh-radio"
                                    value={k.value}
                                    checked={active}
                                    onChange={() => onDrumKit?.(k.value)}
                                    />
                                    <label
                                    htmlFor={inputId}
                                    className={`btn btn-speed ${active ? "active" : ""}`}
                                    >
                                    {k.label}
                                    </label>
                                </div>
                                );
                            })}
                            </div>
                        </div>

                        {/* Melody Style selector */}
                        <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="fw-semibold m-0">Melody Style</label>
                        </div>
                        
                        <div className="speed-toggle" role="group" aria-label="Melody styles">
                            {melodyStyles.map(m => {
                            const id = `melody-${m.id}`;
                            return (
                                <div key={m.id} className="speed-item">
                                <input
                                    id={id}
                                    type="radio"
                                    name="melody-style"
                                    value={m.id}
                                    checked={melodyStyle === m.id}
                                    onChange={() => onMelodyStyle?.(m.id)}
                                    className="vh-radio"
                                />
                                <label
                                    htmlFor={id}
                                    className={`btn btn-speed ${melodyStyle === m.id ? "active" : ""}`}
                                >
                                    {m.label}
                                </label>
                                </div>
                            );
                            })}
                        </div>
                        </div>
                    </section>
                )}
                {activeTab === 'sections' && (
                    <section className="cp-pattern mb-3">
                        <h6 className="mb-3">Manual Section Override</h6>

                        <div className="d-flex gap-2 flex-wrap">

                        {[
                            { id: 0, label: "Auto" },
                            { id: 1, label: "Section 1" },
                            { id: 2, label: "Section 2" },
                            { id: 3, label: "Section 3" },
                            { id: 4, label: "Section 4" },
                            { id: 5, label: "Section 5" },
                        ].map(({ id, label }) => (
                            <button
                            key={id}
                            className={`btn btn-speed ${section === id ? "active" : ""}`}
                            onClick={() => onSection(id)}
                            >
                            {label}
                            </button>
                        ))}

                        </div>
                    </section>
                )}
                {/*Master Volume */}
                <div className="mb-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="m-0 fw-semibold">Master Volume</label>
                        <span className="cp-value-badge">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                    className="cp-range"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => onVolume?.(Number(e.target.value))}
                    aria-label="Master volume"
                    />
                </div>

                {/* Speed */}
                <div className="mb-1 speed-block">
                    <label className="m-0 fw-semibold d-block mb-2">Speed Multiplier</label>
                    <div className="speed-toggle" role="group" aria-label="Speed Multiplier">
                        {speeds.map(v => {
                            const id = `speed-${String(v).replace('.', '-')}`;
                            return (
                                <div key={v} className="speed-item">
                                    <input
                                    id={id}
                                    type="radio"
                                    name="speed"
                                    value={v}
                                    checked={speed === v}
                                    onChange={() => onSpeed(v)}
                                    className="vh-radio"
                                    />
                                    <label htmlFor={id} className={`btn btn-speed ${speed === v ? 'active' : ''}`}>
                                        {v}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </aside>

    );
}