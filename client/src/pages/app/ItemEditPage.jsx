import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { storageApi } from "../../services/api/storageApi";

export function ItemEditPage() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const isSharedWithMe = type === "file" && item?.sharedBy && item.sharedBy !== "self";
  const [newName, setNewName] = useState(item?.filename || item?.name || "");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("viewer");
  const [sharedRecipients, setSharedRecipients] = useState(Array.isArray(item?.sharedWith) ? item.sharedWith : []);
  const [saving, setSaving] = useState(false);

  const saveName = async () => {
    setSaving(true);

    try {
      if (type === "file") {
        await storageApi.renameFile(id, newName);
      } else {
        await storageApi.renameDirectory(id, newName);
      }
      toast.success("Name updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  const shareFile = async () => {
    setSaving(true);

    try {
      await storageApi.shareFile(id, email, permission);
      toast.success("File shared successfully.");
      setSharedRecipients((prev) => [
        ...prev,
        {
          userId: { _id: email, email, name: email },
          permission,
        },
      ]);
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to share file.");
    } finally {
      setSaving(false);
    }
  };

  const removeSharedAccess = async (userId) => {
    if (!userId) return;
    setSaving(true);
    try {
      await storageApi.removeSharedAccess(id, userId);
      setSharedRecipients((prev) =>
        prev.filter((entry) => {
          const entryUser = entry?.userId;
          const entryUserId = typeof entryUser === "object" ? entryUser?._id : entryUser;
          return String(entryUserId) !== String(userId);
        })
      );
      toast.success("Shared access removed.");
    } catch (err) {
      toast.error(err.message || "Failed to remove shared access.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl">Edit {type}</h1>

      {isSharedWithMe ? (
        <Card className="space-y-3 p-6">
          <h2 className="text-lg">Shared File</h2>
          <p className="text-sm text-zinc-400">
            This file was shared with you. Owner-only actions like rename and re-share are disabled.
          </p>
        </Card>
      ) : null}

      {!isSharedWithMe ? (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg">Rename</h2>
          <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="New name" />
          <Button onClick={saveName} disabled={saving || !newName.trim()}>
            {saving ? "Saving..." : "Save Name"}
          </Button>
        </Card>
      ) : null}

      {type === "file" && !isSharedWithMe ? (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg">Share Access</h2>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="User email" />
          <select
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm"
            value={permission}
            onChange={(event) => setPermission(event.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <Button onClick={shareFile} disabled={saving || !email}>
            Share File
          </Button>

          <div className="pt-2">
            <p className="mb-2 text-sm text-zinc-300">Shared with</p>
            {sharedRecipients.length ? (
              <ul className="space-y-2">
                {sharedRecipients.map((entry, idx) => {
                  const user = entry?.userId;
                  const userId = typeof user === "object" ? user?._id : user;
                  const userEmail = typeof user === "object" ? user?.email : null;
                  const userName = typeof user === "object" ? user?.name : null;
                  const userPermission = entry?.permission || entry?.permissions || "viewer";

                  return (
                    <li
                      key={`${String(userId || "unknown")}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-zinc-100">{userName || userEmail || String(userId)}</p>
                        <p className="text-xs text-zinc-400">Permission: {userPermission}</p>
                      </div>
                      <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => removeSharedAccess(userId)} disabled={saving}>
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">No shared users yet.</p>
            )}
          </div>
        </Card>
      ) : null}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        Back
      </Button>
    </section>
  );
}
