// UploadModal - handles file selection & passes file object back up.
// Parent performs actual upload with original backend call sequence.
export default function UploadModal({ onFileSelect, onConfirm, onCancel }) {
  return (
    <div className="rename-box">
      <div>
        <input
          type="file"
          onChange={(e) => onFileSelect(e.target.files[0])}
          className="rename-input"
        />
        <button className="toolbar-btn" onClick={onConfirm}>Ok</button>
        <button className="toolbar-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
