// src/components/OutputDisplay.jsx

export default function OutputDisplay() {
    return (
        <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="fw-bold">Strudel REPL Output</h4>
                <small >Real-time output from the Strudel REPL</small>
            </div>

            {/* REPL Output Area */}
            <div id="output-container" className="code-output-container repl-shell">
                <div id="editor" />
            </div>
        </div>
    );
}