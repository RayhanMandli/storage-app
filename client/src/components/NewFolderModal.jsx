// NewFolderModal - purely visual modal for creating a folder.
// Calls through to provided handlers without changing any logic.
export default function NewFolderModal({ value, onChange, onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border-b border-zinc-800 px-6 py-3 animate-[fadeIn_.18s_ease]">
      <input
        placeholder="Enter folder name"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        value={value}
      />
      <button className="h-9 px-4 rounded-lg bg-cyan-600 text-sm font-medium text-white hover:bg-cyan-500 transition-colors" onClick={onConfirm}>Create</button>
      <button className="h-9 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors" onClick={onCancel}>Cancel</button>
    </div>
  );
}
