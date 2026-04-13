import { useMemo } from "react";
import { UploadCloud } from "lucide-react";

export function FileDropzone({ files, onFiles, uploading = false }) {
  const selected = useMemo(() => files?.length || 0, [files]);

  const handleDrop = (event) => {
    event.preventDefault();
    const nextFiles = Array.from(event.dataTransfer.files || []);
    onFiles(nextFiles);
  };

  return (
    <label
      className="glass block cursor-pointer rounded-2xl border border-dashed border-white/20 p-10 text-center transition hover:border-sky-300/50"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <input type="file" className="hidden" multiple onChange={(event) => onFiles(Array.from(event.target.files || []))} />
      <div className="mx-auto mb-4 w-fit rounded-full bg-sky-400/20 p-4 text-sky-200">
        <UploadCloud size={26} />
      </div>
      <p className="mb-1 font-semibold">Drop files here or click to browse</p>
      <p className="text-sm text-zinc-400">
        {uploading ? "Uploading files..." : `${selected} file(s) selected`}
      </p>
      <p className="mt-1 text-xs text-zinc-500">Maximum size: 100MB per file</p>
    </label>
  );
}
