// src/components/ControlsPanel.jsx

export default function ControlsPanel() {
    const callProcAndPlay = () => {
        if (window && typeof window.ProcAndPlay === 'function'){
            window.ProcAndPlay();
        }
    };
    return (
        <div className="card p-3 h-100">
            <h6 className="fw-bold text-dark mb-3">Controls Panel</h6>

            <div className="mb-2">
                <strong>Pattern 1 (p1)</strong>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    defaultChecked
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    p1: ON
                </label>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>            
            </div>
        </div>

    );
}