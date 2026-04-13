import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, HardDrive, Upload, UserCircle2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";
import { bytesToHuman, usagePercent } from "../../utils/format";
import { userApi } from "../../services/api/userApi";
import { storageApi } from "../../services/api/storageApi";

export function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [rootData, setRootData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [userRes, dirRes] = await Promise.all([userApi.me(), storageApi.getDirectory("root")]);
        setProfile(userRes.data);
        setRootData(dirRes.data);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    );
  }

  const percent = usagePercent(profile?.currentUsage, profile?.limit);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-sm text-zinc-400">Welcome back, {profile?.name || "User"}.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Used Storage" value={bytesToHuman(profile?.currentUsage)} icon={HardDrive} />
        <MetricCard label="Storage Limit" value={bytesToHuman(profile?.limit)} icon={FolderKanban} />
        <MetricCard label="Directories" value={String(rootData?.directories?.length || 0)} icon={FolderKanban} />
        <MetricCard label="Files" value={String(rootData?.files?.length || 0)} icon={Upload} />
      </div>

      <Card className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl">Usage</h2>
          <span className="text-sm text-zinc-300">{percent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300" style={{ width: `${percent}%` }} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink to="/app/directory/root" icon={FolderKanban} title="Open Directory" description="Browse folders and files." />
        <QuickLink to="/app/upload" icon={Upload} title="Upload Files" description="Drag and drop to upload." />
        <QuickLink to="/app/profile" icon={UserCircle2} title="Profile & Settings" description="Manage your account." />
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon: _icon }) {
  const Icon = _icon;
  return (
    <Card className="p-4">
      <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 text-sky-200">
        <Icon size={16} />
      </div>
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </Card>
  );
}

function QuickLink({ to, icon: _icon, title, description }) {
  const Icon = _icon;
  return (
    <Link to={to}>
      <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:border-sky-300/35">
        <div className="mb-3 inline-flex rounded-xl bg-sky-400/15 p-2 text-sky-300">
          <Icon size={16} />
        </div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-zinc-400">{description}</p>
      </Card>
    </Link>
  );
}
