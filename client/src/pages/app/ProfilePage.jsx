import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { bytesToHuman, usagePercent } from "../../utils/format";
import { userApi } from "../../services/api/userApi";
import { useAuthStore } from "../../store/authStore";
import { integrationApi } from "../../services/api/integrationApi";
import { getGoogleDriveConnectUrl } from "../../utils/driveAuth";

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [driveItems, setDriveItems] = useState({ files: [], directories: [] });
  const [driveLoading, setDriveLoading] = useState(false);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const driveConnectUrl = getGoogleDriveConnectUrl();

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await userApi.me();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const setAccountPassword = async () => {
    try {
      await userApi.setPassword(password);
      await refreshUser();
      toast.success("Password set successfully.");
      setPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to set password.");
    }
  };

  const fetchDriveRoot = async (silent = false) => {
    setDriveLoading(true);
    try {
      const { data } = await integrationApi.listDriveRoot();
      setDriveItems({ files: data.files || [], directories: data.directories || [] });
      if (!silent) {
        toast.success("Google Drive refreshed.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to load Google Drive files.");
    } finally {
      setDriveLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.connected) return;
    fetchDriveRoot(true);
  }, [profile?.connected]);

  if (loading || !profile) {
    return <p className="text-zinc-400">Loading profile...</p>;
  }

  const percent = usagePercent(profile.currentUsage, profile.limit);

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl">Profile & Settings</h1>

      <Card className="space-y-3 p-6">
        <Info label="Name" value={profile.name} />
        <Info label="Email" value={profile.email} />
        <Info label="Role" value={profile.role} />
        <Info label="Google Drive Connected" value={profile.connected ? "Yes" : "No"} />
      </Card>

      <Card className="space-y-3 p-6">
        <p className="text-sm text-zinc-300">Google Drive integration</p>
        {!profile.connected ? (
          <>
            <p className="text-sm text-zinc-400">Connect your Google Drive to access cloud files directly from your workspace.</p>
            {driveConnectUrl ? (
              <a href={driveConnectUrl}>
                <Button>Connect Google Drive</Button>
              </a>
            ) : (
              <p className="text-sm text-rose-300">Missing VITE_GOOGLE_CLIENT_ID for Drive connect.</p>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => fetchDriveRoot(false)} disabled={driveLoading}>
                {driveLoading ? "Loading Drive..." : "Refresh Drive Root"}
              </Button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Drive Folders</p>
              {driveItems.directories.length ? (
                <ul className="space-y-1 text-sm text-zinc-300">
                  {driveItems.directories.slice(0, 8).map((dir) => (
                    <li key={dir._id} className="truncate">{dir.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400">No folders found in root.</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Drive Files</p>
              {driveItems.files.length ? (
                <ul className="space-y-1 text-sm text-zinc-300">
                  {driveItems.files.slice(0, 8).map((file) => (
                    <li key={file._id} className="flex items-center justify-between gap-2">
                      <span className="truncate">{file.name}</span>
                      <a
                        className="text-xs text-sky-300"
                        href={integrationApi.getDriveFileDownloadUrl(file._id, "download")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400">No files found in root.</p>
              )}
            </div>
          </>
        )}
      </Card>

      <Card className="space-y-3 p-6">
        <p className="text-sm text-zinc-300">Storage usage</p>
        <p className="text-lg font-semibold">
          {bytesToHuman(profile.currentUsage)} of {bytesToHuman(profile.limit)}
        </p>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300" style={{ width: `${percent}%` }} />
        </div>
      </Card>

      {!profile.hasPassword ? (
        <Card className="space-y-3 p-6">
          <p className="text-sm text-zinc-300">Set account password</p>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button onClick={setAccountPassword}>Save Password</Button>
        </Card>
      ) : null}

    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  );
}
