import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { storageApi } from "../../services/api/storageApi";
import { bytesToHuman, formatDate } from "../../utils/format";

export function ItemViewPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(location.state?.item || null);

  useEffect(() => {
    const hydrateDirectory = async () => {
      if (item || type !== "directory") return;
      try {
        const { data } = await storageApi.getDirectory(id);
        setItem(data.directoryData);
      } catch {
        setItem(null);
      }
    };

    hydrateDirectory();
  }, [id, item, type]);

  if (!item) {
    return (
      <EmptyState
        title="Item details unavailable"
        description="Open this page from the directory to include item context."
        action={<Button onClick={() => navigate("/app/directory/root")}>Back To Directory</Button>}
      />
    );
  }

  const isFile = type === "file";
  const isSharedWithMe = isFile && item?.sharedBy && item.sharedBy !== "self";
  const sharedRecipients = Array.isArray(item?.sharedWith) ? item.sharedWith : [];

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl">{isFile ? "File Details" : "Directory Details"}</h1>
      <Card className="space-y-4 p-6">
        <Info label={isFile ? "Filename" : "Folder Name"} value={item.filename || item.name} />
        <Info label="ID" value={item._id} />
        {isFile ? <Info label="Size" value={bytesToHuman(item.filesize)} /> : null}
        <Info label="Created" value={formatDate(item.createdAt)} />
        {isFile ? <Info label="Type" value={item.extension || "Unknown"} /> : null}
        {isFile ? <Info label="Ownership" value={isSharedWithMe ? "Shared with you" : "Owned by you"} /> : null}
      </Card>

      {isFile && !isSharedWithMe ? (
        <Card className="space-y-3 p-6">
          <h2 className="text-lg">Shared Access</h2>
          {sharedRecipients.length ? (
            <ul className="space-y-2">
              {sharedRecipients.map((entry, idx) => {
                const user = entry?.userId;
                const userId = typeof user === "object" ? user?._id : user;
                const email = typeof user === "object" ? user?.email : null;
                const name = typeof user === "object" ? user?.name : null;
                const permission = entry?.permission || entry?.permissions || "viewer";

                return (
                  <li key={`${String(userId || "unknown")}-${idx}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-sm font-medium text-zinc-100">{name || email || String(userId)}</p>
                    <p className="text-xs text-zinc-400">Permission: {permission}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">This file is not shared with anyone yet.</p>
          )}
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!isSharedWithMe ? (
          <Link to={`/app/item/${type}/${id}/edit`} state={{ item, type }}>
            <Button>Edit</Button>
          </Link>
        ) : null}

        {isFile ? (
          <>
            <Button variant="ghost" onClick={() => window.open(storageApi.getViewUrl(id, "view"), "_blank")}>View File</Button>
            <Button variant="ghost" onClick={() => window.open(storageApi.getViewUrl(id, "download"), "_blank")}>Download</Button>
          </>
        ) : null}

        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-sm text-zinc-200">{value || "-"}</p>
    </div>
  );
}
