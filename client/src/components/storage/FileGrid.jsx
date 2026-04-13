import { Download, File, Folder, Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storageApi } from "../../services/api/storageApi";
import { bytesToHuman } from "../../utils/format";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function FileGrid({ files = [], directories = [], currentDirId, onDelete }) {
  const navigate = useNavigate();

  const openFolder = (dir) => navigate(`/app/directory/${dir._id}`);
  const viewItem = (item, type) =>
    navigate(`/app/item/${type}/${item._id}`, {
      state: { item, type, currentDirId },
    });

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {directories.map((dir) => (
        <Card key={dir._id} className="p-4">
          <div className="mb-3 inline-flex rounded-xl bg-sky-400/20 p-2 text-sky-300">
            <Folder size={18} />
          </div>
          <p className="mb-4 truncate text-sm font-semibold">{dir.name}</p>
          <div className="flex gap-2">
            <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10" onClick={() => openFolder(dir)}>
              Open
            </button>
            <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10" onClick={() => viewItem(dir, "directory")}>
              Manage
            </button>
            <button
              className="rounded-lg bg-rose-400/15 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-400/25"
              onClick={() => onDelete?.(dir._id, "directory")}
            >
              Delete
            </button>
          </div>
        </Card>
      ))}

      {files.map((file) => (
        <Card key={file._id} className="p-4">
          {file.sharedBy && file.sharedBy !== "self" ? (
            <div className="mb-2">
              <Badge className="border-sky-300/30 bg-sky-400/15 text-sky-100">Shared with you</Badge>
            </div>
          ) : Array.isArray(file.sharedWith) && file.sharedWith.length > 0 ? (
            <div className="mb-2">
              <Badge className="border-emerald-300/30 bg-emerald-400/15 text-emerald-100">
                Shared with {file.sharedWith.length}
              </Badge>
            </div>
          ) : null}
          <div className="mb-3 inline-flex rounded-xl bg-emerald-400/20 p-2 text-emerald-300">
            <File size={18} />
          </div>
          <p className="mb-1 truncate text-sm font-semibold">{file.filename}</p>
          <p className="mb-4 text-xs text-zinc-400">{bytesToHuman(file.filesize)}</p>
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              onClick={() => window.open(storageApi.getViewUrl(file._id, "view"), "_blank")}
            >
              <Eye size={13} />
            </button>
            <button
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              onClick={() => window.open(storageApi.getViewUrl(file._id, "download"), "_blank")}
            >
              <Download size={13} />
            </button>
            {file.sharedBy === "self" || !file.sharedBy ? (
              <>
                <button
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  onClick={() => viewItem(file, "file")}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="rounded-lg bg-rose-400/15 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-400/25"
                  onClick={() => onDelete?.(file._id, "file")}
                >
                  <Trash2 size={13} />
                </button>
              </>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
