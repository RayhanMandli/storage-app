import { useEffect, useState, useContext, useCallback } from "react";
import "./App.css";
import "./components/ui-polish.css"; // UI polish layer (styles only)
import { Link, useNavigate, useParams } from "react-router-dom";
import { DirectoryContext } from "./contexts/DirectoryContexts";
// Extracted presentational components – all logic remains here.
import Toolbar from "./components/Toolbar";
import NewFolderModal from "./components/NewFolderModal";
import UploadModal from "./components/UploadModal";
import RenameModal from "./components/RenameModal";
import DirectoryRow from "./components/DirectoryRow";
import FileRow from "./components/FileRow";
import EmptyState from "./components/EmptyState";

/**
 * DirectoryUI - improved, refactored version of your original component.
 * - Preserves all backend endpoints & behavior
 * - Keeps Drive connect behavior the same (click -> redirect -> backend callback)
 * - Better structure, less repetition, safer array handling
 */

const BASE_URL = "http://localhost:4000";

function DirectoryUI() {
    const { routesDisplay, setRoutesDisplay } = useContext(DirectoryContext);

    const [dirItems, setDirItems] = useState({ directories: [], files: [] });
    const [renameBox, setRenameBox] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [message, setMessage] = useState("");
    const [noFilesMsg, setNoFilesMsg] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [foldername, setFoldername] = useState("");
    const [googleDriveConnected, setGoogleDriveConnected] = useState(false);

    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    let { "*": dirPath } = useParams();
    const navigate = useNavigate();

    // --------------------
    // Utility helpers
    // --------------------
    const resetMessages = () => {
        setMessage("");
        setNoFilesMsg("");
    };

    const toggleRenameBox = (oldname = "") => {
        setIsRenaming((v) => !v);
        setRenameBox(oldname);
    };

    const buildParentIdFromPath = (path) => {
        if (!path || path === "directory") return "root";
        return path.replace("directory/", "");
    };

    // --------------------
    // API helpers (keeps code DRY)
    // --------------------
    const apiFetch = async (url, opts = {}) => {
        const defaultOpts = { credentials: "include" };
        const merged = { ...defaultOpts, ...opts };
        const res = await fetch(url, merged);
        // Try to parse JSON but guard against empty responses
        let data;
        try {
            data = await res.json();
        } catch (err) {
            data = null;
        }
        return { res, data };
    };

    const renameItem = async (oldname, id, type) => {
        if (!renameBox || renameBox === oldname) return;
        resetMessages();
        try {
            const { res, data } = await apiFetch(
                `${BASE_URL}/${type === "file" ? "files" : "directory"}/${id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newName: renameBox }),
                }
            );
            if (!res.ok) throw new Error(data?.message || "Rename failed");
            setIsRenaming(false);
            setRenameBox("");
            fetchDirectoryContent(); // refresh
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Rename failed");
        }
    };

    const deleteItem = async (pId, fileId, type) => {
        resetMessages();
        try {
            const { res, data } = await apiFetch(
                `${BASE_URL}/delete/${fileId}${
                    type === "file" ? "?type=file" : ""
                }`,
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
        // preserves original behavior: sends raw octet stream body
        if (!file) {
            setMessage("No file selected.");
            return;
        }
        setMessage("");
        setIsUploading(true);
        try {
            const response = await fetch(`${BASE_URL}/upload/${filename}`, {
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
        if (!foldername) return;
        setIsCreating(false);
        resetMessages();
        try {
            const response = await fetch(
                `${BASE_URL}/directory/${foldername}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        parentdirid: buildParentIdFromPath(dirPath),
                    },
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || "Create failed");
            setFoldername("");
            fetchDirectoryContent();
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Unable to create directory");
        }
    };

    const handleLogout = async () => {
        try {
            const { res } = await apiFetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
            });
            if (res.ok) {
                setLoggedIn(false);
                setUser({});
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
            const { res } = await apiFetch(`${BASE_URL}/auth/all-logout`, {
                method: "POST",
            });
            if (res.ok) {
                setLoggedIn(false);
                setUser({});
                navigate("/login");
            } else {
                setMessage("Logout all failed");
            }
        } catch (err) {
            console.error(err);
            setMessage("Logout all failed");
        }
    };

    // --------------------
    // Google Drive connect & list
    // --------------------
    const handleDriveConnect = () => {
        const params = new URLSearchParams({
            client_id:
                "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com",
            redirect_uri:
                "http://localhost:4000/integrations/google-drive/callback",
            response_type: "code",
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/drive.readonly",
            prompt: "consent",
        });
        // redirect the user to Google consent screen
        window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
        setGoogleDriveConnected(true);
    };

    const listGoogleDriveContent = async () => {
        resetMessages();
        setLoading(true);
        try {
            const { res, data } = await apiFetch(
                `${BASE_URL}/integrations/drive/list-root`
            );
            if (res.status === 401) {
                navigate("/login");
                return;
            }
            if (!res.ok)
                throw new Error(data?.message || "Failed to list Drive");
            // map to your UI format if backend already matches, we keep it as is
            const directories = Array.isArray(data.directories)
                ? data.directories
                : [];
            const files = Array.isArray(data.files) ? data.files : [];
            setDirItems({ directories, files });
            if (directories.length === 0 && files.length === 0) {
                setNoFilesMsg("No Files");
            } else {
                setNoFilesMsg("");
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Failed to list Google Drive");
        } finally {
            setLoading(false);
        }
    };

    // --------------------
    // Unified directory fetch (local directories endpoint)
    // --------------------
    const fetchDirectoryContent = useCallback(async () => {
        resetMessages();
        setLoading(true);

        try {
            // If dirPath is empty or 'directory' -> local root listing endpoint
            const pathToCall = dirPath ? dirPath : "directory";
            const { res, data } = await apiFetch(`${BASE_URL}/${pathToCall}`);

            if (res.status === 401) {
                // not authenticated
                navigate("/login");
                return;
            }

            if (!res.ok) {
                throw new Error(data?.message || "Failed to fetch directory");
            }

            // Ensure safe arrays
            const directories = Array.isArray(data.directories)
                ? data.directories
                : [];
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

    const fetchGoogleDriveFolder = async (folderId) => {
        resetMessages();
        setLoading(true);
        try {
            const { res, data } = await apiFetch(
                `${BASE_URL}/integrations/drive/list/${folderId}`
            );
            if (res.status === 401) {
                navigate("/login");
                return;
            }
            if (!res.ok)
                throw new Error(data?.message || "Failed to list Drive");
            // map to your UI format if backend already matches, we keep it as is
            const directories = Array.isArray(data.directories)
                ? data.directories
                : [];
            const files = Array.isArray(data.files) ? data.files : [];
            setDirItems({ directories, files });
            if (directories.length === 0 && files.length === 0) {
                setNoFilesMsg("No Files");
            } else {
                setNoFilesMsg("");
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Failed to list Google Drive");
        } finally {
            setLoading(false);
        }
    };

    // const handleGoogleFileContent = async (fileId)=>{
    //     try{
    //         const { res, data } = await apiFetch(
    //             `${BASE_URL}/integrations/drive/file/download/${fileId}`
    //         );
    //         if (res.status === 401) {
    //             navigate("/login");
    //             return;
    //         }
    //         if (!res.ok)
    //             throw new Error(data?.message || "Failed to list Drive");
    //     }catch(err){
    //         console.error(err);
    //         setMessage(err.message || "Failed to fetch Google Drive file");
    //     }
    // }

    // --------------------
    // Get current user (and check Drive connection)
    // --------------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { res, data } = await apiFetch(`${BASE_URL}/user`);
                if (res.ok && data) {
                    console.log(data);
                    setUser(data);
                    setLoggedIn(true);
                    const connected = data.connected || false;
                    setGoogleDriveConnected(connected);
                } else {
                    setLoggedIn(false);
                    setUser({});
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        fetchUser();
    }, []);

    // fetch directory when path changes
    useEffect(() => {
        fetchDirectoryContent();
    }, [dirPath, fetchDirectoryContent]);

    // --------------------
    // Helpers for UI / breadcrumb
    // --------------------
    const buildPath = () => {
        if (!dirPath || dirPath === "directory") return routesDisplay || "/";
        if (dirPath.startsWith("gdrive")) {
            return `Google Drive${dirPath.replace("gdrive", "")}`;
        }
        return "/" + dirPath.replace("directory/", "");
    };

    // --------------------
    // Render
    // --------------------
    return (
      <div className="explorer-container">
        {/* Toolbar */}
        <Toolbar
          onNewFolderToggle={() => setIsCreating(v => !v)}
          onUploadToggle={() => setIsUploading(v => !v)}
          showDriveConnect={!googleDriveConnected}
          onDriveConnect={handleDriveConnect}
          currentPathLabel={buildPath()}
          loggedIn={loggedIn}
          userName={user.name}
          onLogout={handleLogout}
          onLogoutAll={handleLogoutAll}
        />

        {/* Modals */}
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

        {/* Messages */}
        {message && <div className="error-message">{message}</div>}

        <div className="explorer-table-wrapper">
          {loading && <div className="loading-indicator">Loading...</div>}
          {noFilesMsg && <div className="no-file-msg">{noFilesMsg}</div>}
          <table className="explorer-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}></th>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {googleDriveConnected && !routesDisplay.startsWith("/Google Drive") && (
                <tr key="google-drive">
                  <td><span role="img" aria-label="folder">📁</span></td>
                  <td className="file-name">
                    <a href="#" onClick={(e) => { e.preventDefault(); setRoutesDisplay("/Google Drive"); listGoogleDriveContent(); }}>
                      Google Drive
                    </a>
                  </td>
                  <td>Folder</td>
                  <td />
                  <td />
                </tr>
              )}
              {dirItems.directories.map(dir => (
                <DirectoryRow
                  key={dir._id || dir.id}
                  dir={dir}
                  onEnterLocal={(name) => setRoutesDisplay(prev => prev ? prev + `/${name}` : `/${name}`)}
                  onEnterDrive={(id, name) => { setRoutesDisplay(prev => prev ? prev + `/${name}` : `/${name}`); fetchGoogleDriveFolder(id); }}
                  onToggleRename={toggleRenameBox}
                  onRename={renameItem}
                  onDelete={deleteItem}
                />
              ))}
              {dirItems.files.map(f => (
                <FileRow
                  key={f._id || f.id}
                  file={f}
                  baseUrl={BASE_URL}
                  onToggleRename={toggleRenameBox}
                  onRename={renameItem}
                  onDelete={deleteItem}
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

export default DirectoryUI;
