// RenameModal - collects new name. Parent still controls rename logic.
export default function RenameModal({ value, onChange, onCancel }) {
  return (
    <div className="rename-box">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rename-input"
      />
      <button className="toolbar-btn" onClick={onCancel}>Cancel</button>
    </div>
  );
}
