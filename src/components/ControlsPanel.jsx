// src/components/ControlsPanel.jsx

export default function ControlsPanel({disabled = false}) {
    
    return (

            <aside className={`cp-card p-3 ${disabled ? 'cp-disabled' : ''}`}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="cp-title m-0">Controls Panel</h5>

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
                            <input type="radio" name="p1" />
                            <div className="tile">
                                <span className="dot" />
                                <span className="label">ON</span>
                            </div>
                        </label>
                        <label className="position-relative">
                            <input
                            type="radio"
                            name="p1"
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
                    <span className="cp-value-badge">40%</span>
                    </div>
                    <input
                    className="cp-range"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    aria-label="Master volume"
                    />
                </div>
            </aside>

    );
}