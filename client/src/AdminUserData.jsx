import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import NewFolderModal from "./components/NewFolderModal";
import UploadModal from "./components/UploadModal";
import RenameModal from "./components/RenameModal";
import DirectoryRow from "./components/DirectoryRow";
import FileRow from "./components/FileRow";
import EmptyState from "./components/EmptyState";

const BASE_URL = "http://localhost:4000";

export default function AdminUserData() {
  const { userId, "*": dirPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [dirItems, setDirItems] = useState({ directories: [], files: [] });
  const [renameBox, setRenameBox] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [message, setMessage] = useState("");
  const [noFilesMsg, setNoFilesMsg] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [foldername, setFoldername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("/");
  const [targetUserLabel, setTargetUserLabel] = useState(
    location.state?.userEmail || location.state?.userName || ""
  );

  const allowCrud = currentUser.role === "owner";

  const appendUserId = (url) => (url.includes("?") ? `${url}&userId=${userId}` : `${url}?userId=${userId}`);

  const apiFetchTarget = async (path, opts = {}) => {
    const merged = { credentials: "include", ...opts };
    const res = await fetch(appendUserId(`${BASE_URL}/${path}`), merged);
    let data;
    try {
      data = await res.json();
    } catch (err) {
      data = null;
    }
    return { res, data };
  };

  const apiFetchCurrent = async (path, opts = {}) => {
    const merged = { credentials: "include", ...opts };
    const res = await fetch(`${BASE_URL}/${path}`, merged);
    let data;
    try {
      data = await res.json();
    } catch (err) {
      data = null;
    }
    return { res, data };
  };

  const resetMessages = () => {
    setMessage("");
    setNoFilesMsg("");
  };

  const buildParentIdFromPath = (path) => {
    if (!path || path === "directory") return "root";
    return path.replace("directory/", "");
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const handleLogout = async () => {
    try {
      const { res } = await apiFetchCurrent("auth/logout", { method: "POST" });
      if (res.ok) {
        setLoggedIn(false);
        setCurrentUser({});
        navigate("/login");
      } else {
        setMessage("Logout failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Logout failed");
    }
  };
  const handleLogoutAll = async () => {
    try {
      const { res } = await apiFetchCurrent("auth/all-logout", { method: "POST" });
      if (res.ok) {
        setLoggedIn(false);
        setCurrentUser({});
        navigate("/login");
      } else {
        setMessage("Logout all failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Logout all failed");
    }
  };
  const handleLogoutWithClose = async () => {
    setIsMenuOpen(false);
    await handleLogout();
  };
  const handleLogoutAllWithClose = async () => {
    setIsMenuOpen(false);
    await handleLogoutAll();
  };

  const renameItem = async (oldname, id, type) => {
    if (!allowCrud) return;
    if (!renameBox || renameBox === oldname) return;
    resetMessages();
    try {
      const { res, data } = await apiFetchTarget(
        `${type === "file" ? "files" : "directory"}/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName: renameBox }),
        }
      );
      if (!res.ok) throw new Error(data?.message || "Rename failed");
      setIsRenaming(false);
      setRenameBox("");
      fetchDirectoryContent();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Rename failed");
    }
  };

  const deleteItem = async (pId, fileId, type) => {
    if (!allowCrud) return;
    resetMessages();
    try {
      const { res, data } = await apiFetchTarget(
        `delete/${fileId}${type === "file" ? "?type=file" : ""}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            parentdirid: pId,
          },
        }
      );
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      setMessage(data?.message || "Deleted");
      fetchDirectoryContent();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Delete failed");
    }
  };

  const uploadFileToServer = async (pId, filename) => {
    if (!allowCrud) return;
    if (!file) {
      setMessage("No file selected.");
      return;
    }
    setMessage("");
    setIsUploading(true);
    try {
      const response = await fetch(appendUserId(`${BASE_URL}/upload/${filename}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          parentdirid: pId || "root",
        },
        credentials: "include",
        body: file,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Upload failed");
      setMessage(data.message || "Uploaded");
      setIsUploading(false);
      setFile(null);
      fetchDirectoryContent();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error uploading file");
      setIsUploading(false);
    }
  };

  const createFolderOnServer = async () => {
    if (!allowCrud) return;
    if (!foldername) return;
    setIsCreating(false);
    resetMessages();
    try {
      const response = await fetch(appendUserId(`${BASE_URL}/directory/${foldername}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          parentdirid: buildParentIdFromPath(dirPath),
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Create failed");
      setFoldername("");
      fetchDirectoryContent();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Unable to create directory");
    }
  };

  const fetchDirectoryContent = useCallback(async () => {
    resetMessages();
    setLoading(true);
    try {
      const pathToCall = dirPath ? dirPath : "directory";
      const { res, data } = await apiFetchTarget(pathToCall);
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(data?.message || "Failed to fetch directory");
      const directories = Array.isArray(data.directories) ? data.directories : [];
      const files = Array.isArray(data.files) ? data.files : [];
      setDirItems({ directories, files });
      if (directories.length === 0 && files.length === 0) {
        setNoFilesMsg("No Files");
      } else {
        setNoFilesMsg("");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, [dirPath, navigate]);

  const buildPathLabel = () => {
    if (!dirPath || dirPath === "directory") return breadcrumb || "/";
    if (dirPath.startsWith("gdrive")) return `Google Drive${dirPath.replace("gdrive", "")}`;
    return "/" + dirPath.replace("directory/", "");
  };

  const syncCurrentUser = useCallback(async () => {
    const { res, data } = await apiFetchCurrent("user");
    if (res.ok && data) {
      setCurrentUser(data);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  }, [navigate]);

  const fetchTargetLabel = useCallback(async () => {
    if (targetUserLabel) return;
    const { res, data } = await apiFetchCurrent("user/all");
    if (res.ok && data && Array.isArray(data.users)) {
      const match = data.users.find((u) => u._id === userId);
      if (match) {
        setTargetUserLabel(match.email || match.name || userId);
      }
    }
  }, [targetUserLabel, userId]);

  useEffect(() => {
    syncCurrentUser();
    fetchDirectoryContent();
    fetchTargetLabel();
  }, [syncCurrentUser, fetchDirectoryContent, fetchTargetLabel]);

  useEffect(() => {
    if (!dirPath || dirPath === "directory") {
      setBreadcrumb("/");
    }
  }, [dirPath]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          className="h-9 px-4 rounded border border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-100 hover:bg-zinc-800 transition-colors"
          onClick={() => navigate("/users")}
        >
          Back
        </button>
        <div className="font-semibold text-zinc-200">
          Viewing Data for: {targetUserLabel || userId}
        </div>
      </div>

      <Toolbar
        onNewFolderToggle={() => setIsCreating((v) => !v)}
        onUploadToggle={() => setIsUploading((v) => !v)}
        showDriveConnect={false}
        onDriveConnect={() => {}}
        currentPathLabel={buildPathLabel()}
        loggedIn={loggedIn}
        userName={currentUser.name}
        onLogout={handleLogoutWithClose}
        onLogoutAll={handleLogoutAllWithClose}
        isMenuOpen={isMenuOpen}
        onMenuToggle={toggleMenu}
        showNewFolder={allowCrud}
        showUpload={allowCrud}
      />

      {allowCrud && (
        <div>
          {isCreating && (
            <NewFolderModal
              value={foldername}
              onChange={setFoldername}
              onConfirm={createFolderOnServer}
              onCancel={() => setIsCreating(false)}
            />
          )}
          {isUploading && (
            <UploadModal
              onFileSelect={setFile}
              onConfirm={() => uploadFileToServer(buildParentIdFromPath(dirPath), file ? file.name : "")}
              onCancel={() => setIsUploading(false)}
            />
          )}
          {isRenaming && (
            <RenameModal
              value={renameBox}
              onChange={setRenameBox}
              onCancel={() => setIsRenaming(false)}
            />
          )}
        </div>
      )}

      {message && (
        <div className="mx-4 mt-3 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
          {message}
        </div>
      )}

      <div className="flex-1 overflow-auto px-4 pb-6 pt-2">
        {loading && <div className="text-sm text-zinc-400">Loading...</div>}
        {noFilesMsg && <div className="text-center text-sm text-zinc-500">{noFilesMsg}</div>}
        <table className="w-full border-collapse bg-zinc-900 shadow-sm shadow-black/20 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-400">
            <tr>
              <th className="w-10 px-4 py-2 text-left"></th>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Type</th>
              <th className="px-2 py-2 text-left">Actions</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {dirItems.directories.map((dir) => (
              <DirectoryRow
                key={dir._id || dir.id}
                dir={dir}
                onEnterLocal={(name) => setBreadcrumb((prev) => (prev && prev !== "/" ? `${prev}/${name}` : `/${name}`))}
                onEnterDrive={() => {}}
                onToggleRename={(oldname) => {
                  setIsRenaming(true);
                  setRenameBox(oldname);
                }}
                onRename={renameItem}
                onDelete={deleteItem}
                readOnly={!allowCrud}
                linkBuilder={(id) => `/admin/users/${userId}/data/directory/${id}`}
              />
            ))}
            {dirItems.files.map((f) => (
              <FileRow
                key={f._id || f.id}
                file={f}
                baseUrl={BASE_URL}
                onToggleRename={(oldname) => {
                  setIsRenaming(true);
                  setRenameBox(oldname);
                }}
                onRename={renameItem}
                onDelete={deleteItem}
                readOnly={!allowCrud}
              />
            ))}
            <EmptyState
              visible={!loading && dirItems.directories.length === 0 && dirItems.files.length === 0 && !noFilesMsg}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
