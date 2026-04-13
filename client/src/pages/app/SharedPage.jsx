import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FileGrid } from "../../components/storage/FileGrid";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import { storageApi } from "../../services/api/storageApi";

export function SharedPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadSharedFiles = async () => {
      setLoading(true);
      try {
        const { data } = await storageApi.getDirectory("root");
        const incomingShared = (data.files || []).filter((file) => file?.sharedBy && file.sharedBy !== "self");

        const deduped = [];
        const seen = new Set();
        for (const file of incomingShared) {
          if (seen.has(file._id)) continue;
          seen.add(file._id);
          deduped.push(file);
        }

        setFiles(deduped);
      } catch (err) {
        toast.error(err.message || "Failed to load shared files.");
      } finally {
        setLoading(false);
      }
    };

    loadSharedFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.toLowerCase();
    return files.filter((file) => (file.filename || "").toLowerCase().includes(q));
  }, [files, search]);

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
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl">Shared With You</h1>
        <p className="text-sm text-zinc-400">Files other users shared with your account.</p>
      </div>

      <Input
        className="max-w-md"
        placeholder="Search shared files"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {!filteredFiles.length ? (
        <EmptyState
          title="No shared files yet"
          description="When someone shares a file with you, it will appear here."
        />
      ) : (
        <FileGrid files={filteredFiles} directories={[]} currentDirId="root" />
      )}
    </section>
  );
}
