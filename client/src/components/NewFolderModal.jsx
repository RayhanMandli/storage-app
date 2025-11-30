// NewFolderModal - purely visual modal for creating a folder.
// Calls through to provided handlers without changing any logic.
export default function NewFolderModal({ value, onChange, onConfirm, onCancel }) {
  return (
    <div className="rename-box">
      <input
        placeholder="Enter Directory Name"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        className="rename-input"
        value={value}
      />
      <button className="toolbar-btn" onClick={onConfirm}>Ok</button>
      <button className="toolbar-btn" onClick={onCancel}>Cancel</button>
    </div>
  );
}
