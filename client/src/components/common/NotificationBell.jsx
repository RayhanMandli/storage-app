import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { storageApi } from "../../services/api/storageApi";
import { Button } from "../ui/Button";

const READ_KEY = "nebula.notifications.readIds";
const SEEN_KEY = "nebula.notifications.seenIds";
const POLL_MS = 25000;

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map(String));
  } catch {
    return new Set();
  }
}

function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => loadSet(READ_KEY));

  useEffect(() => {
    let isFirstLoad = true;
    let timerId;

    const pollShared = async () => {
      try {
        const { data } = await storageApi.getDirectory("root");
        const incoming = (data.files || []).filter((file) => file?.sharedBy && file.sharedBy !== "self");

        const deduped = [];
        const seenLocal = new Set();
        for (const file of incoming) {
          const id = String(file._id);
          if (seenLocal.has(id)) continue;
          seenLocal.add(id);
          deduped.push(file);
        }

        const previousSeen = loadSet(SEEN_KEY);
        const currentIds = new Set(deduped.map((file) => String(file._id)));

        if (!isFirstLoad) {
          const newlyShared = deduped.filter((file) => !previousSeen.has(String(file._id)));
          if (newlyShared.length > 0) {
            toast.success(
              newlyShared.length === 1
                ? `New shared file: ${newlyShared[0].filename}`
                : `${newlyShared.length} new files were shared with you.`
            );
          }
        }

        saveSet(SEEN_KEY, currentIds);
        setNotifications(deduped);
        isFirstLoad = false;
      } catch {
        // Silent polling failure to avoid notification spam.
      }
    };

    pollShared();
    timerId = window.setInterval(pollShared, POLL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(String(n._id))).length,
    [notifications, readIds]
  );

  const markRead = (id) => {
    const next = new Set(readIds);
    next.add(String(id));
    setReadIds(next);
    saveSet(READ_KEY, next);
  };

  const markAllRead = () => {
    const next = new Set(readIds);
    for (const entry of notifications) {
      next.add(String(entry._id));
    }
    setReadIds(next);
    saveSet(READ_KEY, next);
  };

  const openNotification = (item) => {
    markRead(item._id);
    setOpen(false);
    navigate(`/app/item/file/${item._id}`, {
      state: { item, type: "file" },
    });
  };

  return (
    <div className="relative">
      <button
        className="relative rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-200 transition hover:bg-white/10"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-400 px-1 text-center text-[10px] font-bold text-zinc-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed left-1/2 top-20 z-40 w-[calc(100vw-1.25rem)] max-w-[340px] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-xl md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-[340px] md:translate-x-0">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-100">Notifications</p>
            <button
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-300 hover:bg-white/5"
              onClick={markAllRead}
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-auto">
            {!notifications.length ? (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400">
                No notifications yet.
              </p>
            ) : (
              notifications.map((item) => {
                const isUnread = !readIds.has(String(item._id));
                return (
                  <button
                    key={item._id}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      isUnread
                        ? "border-sky-300/40 bg-sky-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => openNotification(item)}
                  >
                    <p className="truncate text-sm font-medium text-zinc-100">{item.filename}</p>
                    <p className="text-xs text-zinc-400">
                      {item.sharedBy && item.sharedBy !== "self" ? `Shared by ${item.sharedBy}` : "Shared with you"}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-3">
            <Button variant="ghost" className="w-full py-2" onClick={() => navigate("/app/shared")}>
              Open Shared Files
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
