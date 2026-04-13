import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { storageApi } from "../../services/api/storageApi";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { FileGrid } from "../../components/storage/FileGrid";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import { DirectoryBreadcrumbs } from "../../components/storage/DirectoryBreadcrumbs";

export function DirectoryPage() {
  const { id = "root" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ files: [], directories: [], directoryData: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dirname, setDirname] = useState("");

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await storageApi.getDirectory(id);
      setData(data);
    } catch (err) {
      setError(err.message || "Failed to load directory");
      toast.error(err.message || "Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  useEffect(() => {
    sessionStorage.setItem("lastDirectoryId", id);
  }, [id]);

  const filtered = useMemo(() => {
    const ownFiles = data.files.filter((file) => !file?.sharedBy || file.sharedBy === "self");

    if (!search) return data;
    const q = search.toLowerCase();
    return {
      ...data,
      files: ownFiles.filter((file) => file.filename.toLowerCase().includes(q)),
      directories: data.directories.filter((dir) => dir.name.toLowerCase().includes(q)),
    };
  }, [data, search]);

  const viewData = useMemo(
    () => ({
      ...filtered,
      files: filtered.files.filter((file) => !file?.sharedBy || file.sharedBy === "self"),
    }),
    [filtered]
  );

  const createDirectory = async () => {
    if (!dirname.trim()) return;
    try {
      await storageApi.createDirectory(dirname.trim(), id);
      setDirname("");
      toast.success("Folder created.");
      loadDirectory();
    } catch (err) {
      toast.error(err.message || "Failed to create folder.");
    }
  };

  const deleteItem = async (itemId, type) => {
    try {
      await storageApi.deleteItem(itemId, type);
      toast.success(type === "file" ? "File deleted." : "Folder deleted.");
      loadDirectory();
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap gap-3">
        <Input
          className="min-w-[220px] flex-1"
          placeholder="Search files and folders"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Input
          className="w-52"
          placeholder="New folder name"
          value={dirname}
          onChange={(event) => setDirname(event.target.value)}
        />
        <Button onClick={createDirectory}>
          <Plus size={16} />
          New Folder
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/app/upload?dir=${id}`)}>
          Upload Here
        </Button>
      </div>

      <DirectoryBreadcrumbs
        path={data.directoryData?.path || []}
        onNavigate={(dirId) => navigate(`/app/directory/${dirId || "root"}`)}
      />

      {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

      {!viewData.files.length && !viewData.directories.length ? (
        <EmptyState
          title="This folder is empty"
          description="Create a folder or upload files to get started. Shared files are available in the Shared tab."
          action={<Button onClick={() => navigate(`/app/upload?dir=${id}`)}>Go To Upload</Button>}
        />
      ) : (
        <FileGrid
          files={viewData.files}
          directories={viewData.directories}
          currentDirId={id}
          onDelete={deleteItem}
        />
      )}
    </section>
  );
}
