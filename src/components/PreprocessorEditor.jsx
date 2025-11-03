// src/components/PreprocessorEditor.jsx

export default function PreprocessorEditor() {
    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="f2-bold">Preprocessor Editor</h4>
                <small className="text-muted">Edit your preprocessing code here</small>
                
            </div>
            <div className="row mb-2">
                <div className="col">
                    <label htmlFor="proc" className="form-label">Text to preprocess</label>
                </div>
            </div>
            
            
            
            <textarea
                id="proc"
                className="form-control code-editor"
                rows={15}
                placeholder="Paste or edit the Strudel code here...."
            />
        </div>
    );
}