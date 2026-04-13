import { Home, FolderTree, Share2, Upload, UserCircle2, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const items = [
  { to: "/app", icon: Home, label: "Dashboard" },
  { to: "/app/directory/root", icon: FolderTree, label: "Directory" },
  { to: "/app/shared", icon: Share2, label: "Shared" },
  { to: "/app/upload", icon: Upload, label: "Upload" },
  { to: "/app/profile", icon: UserCircle2, label: "Profile" },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/60 transition md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-zinc-900/95 p-6 backdrop-blur-xl transition md:static md:z-auto md:w-64 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className="mb-8 ml-auto rounded-lg border border-white/10 p-2 text-zinc-400 md:hidden"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <div className="mb-8 text-xl font-semibold">NebulaStorage</div>

        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    isActive ? "bg-sky-400/15 text-sky-200" : "text-zinc-300 hover:bg-white/5"
                  )
                }
                onClick={onClose}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
