// UploadModal - handles file selection & passes file object back up.
// Parent performs actual upload with original backend call sequence.
export default function UploadModal({ onFileSelect, onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border-b border-zinc-800 px-6 py-3 animate-[fadeIn_.18s_ease]">
      <input
        type="file"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
      />
      <button className="h-9 px-4 rounded-lg bg-cyan-600 text-sm font-medium text-white hover:bg-cyan-500 transition-colors" onClick={onConfirm}>Upload</button>
      <button className="h-9 px-4 rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors" onClick={onCancel}>Cancel</button>
    </div>
  );
}
