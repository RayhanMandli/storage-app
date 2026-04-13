import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FileDropzone } from "../../components/storage/FileDropzone";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { storageApi } from "../../services/api/storageApi";
import { bytesToHuman } from "../../utils/format";
import { MAX_FILE_SIZE_BYTES, splitFilesBySize } from "../../utils/uploadConstraints";

export function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetDirFromQuery = searchParams.get("dir");
  const targetDirFromSession = sessionStorage.getItem("lastDirectoryId");
  const parentDirId = targetDirFromQuery || targetDirFromSession || "root";
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const overallProgress = useMemo(() => {
    if (!files.length) return 0;
    const total = files.reduce((sum, file) => sum + (fileProgress[file.name] || 0), 0);
    return Math.round(total / files.length);
  }, [fileProgress, files]);

  const handleFiles = (incomingFiles) => {
    const { accepted, rejected } = splitFilesBySize(incomingFiles, MAX_FILE_SIZE_BYTES);
    setFiles(accepted);
    setRejectedFiles(rejected);

    if (rejected.length) {
      setError(`Some files exceed ${bytesToHuman(MAX_FILE_SIZE_BYTES)} and were excluded.`);
      toast.error(`Skipped ${rejected.length} file(s) over ${bytesToHuman(MAX_FILE_SIZE_BYTES)}.`);
    } else {
      setError("");
    }

    const nextProgress = {};
    for (const file of accepted) nextProgress[file.name] = 0;
    setFileProgress(nextProgress);
  };

  const uploadAll = async () => {
    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        await storageApi.uploadFile(file, parentDirId, (percent) => {
          setFileProgress((prev) => ({ ...prev, [file.name]: percent }));
        });
        setFileProgress((prev) => ({ ...prev, [file.name]: 100 }));
      }
      toast.success("All files uploaded successfully.");
      navigate(`/app/directory/${parentDirId}`);
    } catch (err) {
      setError(err.message || "Upload failed");
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl">Upload Files</h1>
      <p className="text-sm text-zinc-400">Drop multiple files and send them directly to your selected directory.</p>
      <p className="text-xs text-zinc-500">Target folder: {parentDirId === "root" ? "Root" : parentDirId}</p>

      <FileDropzone files={files} onFiles={handleFiles} uploading={uploading} />

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-zinc-300">Selected files</p>
          <p className="text-xs text-zinc-400">Max: {bytesToHuman(MAX_FILE_SIZE_BYTES)} per file</p>
        </div>

        {uploading ? (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Overall progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300 transition-all duration-200"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <ul className="space-y-1 text-sm text-zinc-400">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`} className="rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate">{file.name}</span>
                <span className="text-xs">{bytesToHuman(file.size)}</span>
              </div>
              {uploading ? (
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-sky-300 transition-all duration-200"
                    style={{ width: `${fileProgress[file.name] || 0}%` }}
                  />
                </div>
              ) : null}
            </li>
          ))}
          {!files.length ? <li>No files selected.</li> : null}
        </ul>

        {rejectedFiles.length ? (
          <div className="mt-4 rounded-xl border border-rose-300/30 bg-rose-400/10 p-3">
            <p className="mb-1 text-sm text-rose-200">Rejected files (over 100MB)</p>
            <ul className="space-y-1 text-xs text-rose-100/80">
              {rejectedFiles.map((file) => (
                <li key={`${file.name}-${file.size}`}>{file.name} - {bytesToHuman(file.size)}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex gap-3">
        <Button onClick={uploadAll} disabled={uploading || !files.length}>
          {uploading ? "Uploading..." : "Start Upload"}
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/app/directory/${parentDirId}`)}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
