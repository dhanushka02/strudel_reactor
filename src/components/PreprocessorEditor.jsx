// src/components/PreprocessorEditor.jsx

export default function PreprocessorEditor() {
    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="f2-bold text-dark">Preprocessor Editor</h6>
                <small className="text-muted">Edit your preprocessing code here</small>
            </div>
            <label htmlFor="proc" className="form-label">Text to preprocess</label>
            <textarea
                id="proc"
                className="form-control"
                rows={15}
                placeholder="Paste or edit the Strudel code here...."
            />
        </div>
    );
}