// src/components/ControlsPanel.jsx

const speeds = [0.5, 1, 1.5, 2];

export default function ControlsPanel({disabled = false, volume, onVolume, speed, onSpeed, p1, onP1, p2, onP2 }) {

    
    
    return (

            <aside className={`cp-card p-3 ${disabled ? 'cp-disabled' : ''}`}>
                <h5 className="cp-title m-0">Controls Panel</h5>
                <small className="text-muted">Real-time control over the Strudel REPL</small>
                <div className="d-flex align-items-center justify-content-between mb-3 mt-3">
                    

                    {/* Segmented Tabs */}
                    <div className="cp-tabs" role="tablist" aria-label="Control Tabs">
                        <button className="cp-tab" role="tab" aria-selected="true" >Instruments</button>
                        <button className="cp-tab" role="tab" aria-selected="false" >Effects</button>
                    </div>
                </div>

                {/* Pattern 1 */}
                <section className="cp-pattern mb-3">
                    <h6 className="mb-2">Pattern 1 (p1)</h6>
                    <div className="cp-radio">
                        <label className="position-relative">
                            <input type="radio" name="p1" checked={p1 === 'on'} onChange={() => onP1?.('on')} />
                            <div className="tile">
                                <span className="dot" />
                                <span className="label">ON</span>
                            </div>
                        </label>
                        <label className="position-relative">
                            <input
                            type="radio"
                            name="p1"
                            checked={p1 === 'hush'}
                            onChange={() => onP1?.('hush')}
                            />
                            <div className="tile">
                            <span className="dot" />
                            <span className="label">HUSH</span>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Pattern 2 */}
                <section className="cp-pattern mb-3">
                    <h6 className="mb-2">Pattern 2 (p2)</h6>
                    <div className="cp-radio">
                        <label className="position-relative">
                        <input
                        type="radio"
                        name="p2"
                        checked={p2 === 'on'}
                        onChange={() => onP2?.('on')}
                        />
                        <div className="tile">
                        <span className="dot" />
                        <span className="label">ON</span>
                        </div>
                    </label>
                    <label className="position-relative">
                        <input
                        type="radio"
                        name="p2"
                        checked={p2 === 'hush'}
                        onChange={() => onP2?.('hush')}
                        />
                        <div className="tile">
                        <span className="dot" />
                        <span className="label">HUSH</span>
                        </div>
                    </label>
                    </div>
                </section>

                {/* Volume */}
                <hr className="my-3" />
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="m-0 fw-semibold">Volume</label>
                    <span className="cp-value-badge">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                    className="cp-range"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolume?.(Number(e.target.value))}
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