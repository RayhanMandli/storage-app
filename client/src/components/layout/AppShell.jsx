import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "../../store/authStore";
import { NotificationBell } from "../common/NotificationBell";

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error(err.message || "Logout failed.");
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <button className="rounded-lg border border-white/10 p-2 md:hidden" onClick={() => setOpen(true)}>
            <Menu size={16} />
          </button>
          <div className="text-sm text-zinc-400">{pathname}</div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
