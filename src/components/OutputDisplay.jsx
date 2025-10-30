// src/components/OutputDisplay.jsx

export default function OutputDisplay() {
    return (
        <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold text-dark">Strudel REPL Output</h6>
                <span className="badge bg-light text-dark border">Stopped</span>
            </div>

            {/* REPL Output Area */}
            <div className="repl-shell">
                <div id="editor" />
            </div>        
        </div>
    );
}