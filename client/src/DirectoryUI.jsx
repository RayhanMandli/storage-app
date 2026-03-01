import { useEffect, useState, useContext, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DirectoryContext } from "./contexts/DirectoryContexts";
// Extracted presentational components – all logic remains here.
import Toolbar from "./components/Toolbar";
import NewFolderModal from "./components/NewFolderModal";
import UploadModal from "./components/UploadModal";
import RenameModal from "./components/RenameModal";
import FileRow from "./components/FileRow";
import ShareModal from "./components/ShareModal";

/**
 * DirectoryUI - improved, refactored version of your original component.
 * - Preserves all backend endpoints & behavior
 * - Keeps Drive connect behavior the same (click -> redirect -> backend callback)
 * - Better structure, less repetition, safer array handling
 */

const BASE_URL = "http://localhost:4000";

function DirectoryUI() {
    const { routesDisplay, setRoutesDisplay } = useContext(DirectoryContext);
    const [routesNameArray, setRoutesNameArray] = useState(["root"]);
    const [routesIdArray, setRoutesIdArray] = useState([])

    const [dirItems, setDirItems] = useState({ directories: [], files: [] });
    const [renameBox, setRenameBox] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [message, setMessage] = useState("");
    const [noFilesMsg, setNoFilesMsg] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [foldername, setFoldername] = useState("");
    const [googleDriveConnected, setGoogleDriveConnected] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareItem, setShareItem] = useState(null);
    const [shareItemType, setShareItemType] = useState(null);

    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    let { "*": dirPath } = useParams();
    const navigate = useNavigate();

    // --------------------
    // Utility helpers
    // --------------------
    const formatSize = (size) => {
        if (size == null || Number.isNaN(Number(size))) return "—";
        const units = ["B", "KB", "MB", "GB", "TB"];
        let value = Number(size);
        let unitIndex = 0;
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex += 1;
        }
        const fixed = value >= 10 || unitIndex === 0 ? 0 : 1;
        return `${value.toFixed(fixed)} ${units[unitIndex]}`;
    };
    const formatDate = (date) => {
        if (!date) return "—";
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return "—";
        return parsed.toLocaleString();
    };

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
        } catch (error) {
            console.log(error);
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
                    filesize: file.size,
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

    const toggleMenu = () => setIsMenuOpen((v) => !v);
    const handleLogoutWithClose = async () => {
        setIsMenuOpen(false);
        await handleLogout();
    };
    const handleLogoutAllWithClose = async () => {
        setIsMenuOpen(false);
        await handleLogoutAll();
    };
    const handleSetPasswordWithClose = async () => {
        setIsMenuOpen(false);
        navigate("/set-password");
    };

    // --------------------
    // Share modal handlers (placeholder functions for backend integration)
    // --------------------
    const handleOpenShareModal = (item, itemType) => {
        setShareItem(item);
        setShareItemType(itemType);
        setShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setShareModalOpen(false);
        setShareItem(null);
        setShareItemType(null);
    };

    const handleShareUser = async (email, permission) => {
        try {
            const {res, data} = await apiFetch(`${BASE_URL}/share/${shareItem._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    itemType: shareItemType,
                    email,
                    permission,
                }),
            });
            if (!res.ok) {
                throw new Error(data?.message || "Failed to share item");
            }
            setMessage("Item shared successfully");
            if (shareItem.sharedWith) {
                shareItem.sharedWith.push({
                    userId: Date.now().toString(),
                    email,
                    permission,
                });
            } else {
                shareItem.sharedWith = [
                    {
                        userId: Date.now().toString(),
                        email,
                        permission,
                    },
                ];
            }
            setShareItem({ ...shareItem });
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Failed to share item");
            return;
        }
    };

    const handleUpdateShare = async (userId, newPermission) => {
        // Update local state
        if (shareItem.sharedWith) {
            const userIndex = shareItem.sharedWith.findIndex(
                (u) => (u._id || u.userId) === userId
            );
            if (userIndex !== -1) {
                shareItem.sharedWith[userIndex].permission = newPermission;
                setShareItem({ ...shareItem });
            }
        }
    };

    const handleRemoveShare = async (userId) => {
        try {
            const {res,data} = await apiFetch(
                `${BASE_URL}/share/${shareItem._id}/${userId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (!res.ok) {
                throw new Error(data?.message || "Failed to share item");
            }
            setMessage("Item shared successfully");
            if (shareItem.sharedWith) {
                shareItem.sharedWith = shareItem.sharedWith.filter(
                    (u) => (u._id || u.userId) !== userId
                );
                setShareItem({ ...shareItem });
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Failed to share item");
            return;
        }
    };

    const handleEnableLinkShare = async (permission) => {
        // Placeholder: Backend endpoint would be POST /api/share/link
        console.log("Enable link sharing:", {
            itemId: shareItem._id || shareItem.id,
            permission,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Update local state
        shareItem.linkShare = {
            enabled: true,
            token: Math.random().toString(36).substring(7),
            permission,
        };
        setShareItem({ ...shareItem });
    };

    const handleDisableLinkShare = async () => {
        // Placeholder: Backend endpoint would be DELETE /api/share/link/:itemId
        console.log("Disable link sharing:", {
            itemId: shareItem._id || shareItem.id,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Update local state
        if (shareItem.linkShare) {
            shareItem.linkShare.enabled = false;
            setShareItem({ ...shareItem });
        }
    };

    const handleUpdateLinkPermission = async (permission) => {
        // Placeholder: Backend endpoint would be PATCH /api/share/link/:itemId
        console.log("Update link permission:", {
            itemId: shareItem._id || shareItem.id,
            permission,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Update local state
        if (shareItem.linkShare) {
            shareItem.linkShare.permission = permission;
            setShareItem({ ...shareItem });
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
            console.log(data);
            setDirItems({ directories, files });
            if(data.directoryData.path.length < 1 ){
                setRoutesNameArray(["root"])
                setRoutesIdArray(["root"])
            }else{
                setRoutesNameArray(data.directoryData.path.map(d => d.name))
                setRoutesIdArray(data.directoryData.path.map(d => d._id))
            }

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
    console.log(routesDisplay)
    const buildPath = () => {
        if (!dirPath || dirPath === "directory") return "/";
        if (dirPath.startsWith("gdrive")) {
            return `Google Drive${dirPath.replace("gdrive", "")}`;
        }
        
        // const directory = dirItems.directories.find(dir => dir._id === dirPath.replace("directory/", ""))
        // return "/" + ;
        return routesDisplay
    };

    // --------------------
    // Render
    // --------------------
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-screen">
                {/* Logo/Brand */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <h1 className="text-lg font-semibold text-zinc-100">G Drive Express</h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link 
                        to="/directory" 
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                    <Link 
                        to="/directory" 
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        My Files
                    </Link>
                    <button 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Shared with me
                    </button>
                    {googleDriveConnected && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                setRoutesDisplay("/Google Drive");
                                listGoogleDriveContent();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Google Drive
                        </button>
                    )}
                    <Link 
                        to="/users" 
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Users
                    </Link>

                    <div className="pt-4 mt-4 border-t border-zinc-800 space-y-1">
                        <button
                            onClick={() => setIsCreating((v) => !v)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Folder
                        </button>
                        <button
                            onClick={() => setIsUploading((v) => !v)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload File
                        </button>
                        
                        {!googleDriveConnected && (
                            <button
                                onClick={handleDriveConnect}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Connect Drive
                            </button>
                        )}
                    </div>
                </nav>
                  {/* storageLimit       */}
                  <div className="px-3 py-4 border-t border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400">Storage</span>
                                <span className="text-zinc-300 font-medium">
                                    {formatSize(user.currentUsage)} / {formatSize(user.limit)}
                                </span>
                            </div>
                            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                                        (user.currentUsage / user.limit) * 100 >= 90
                                            ? 'bg-red-500'
                                            : (user.currentUsage / user.limit) * 100 >= 75
                                            ? 'bg-yellow-500'
                                            : 'bg-cyan-500'
                                    }`}
                                    style={{
                                        width: `${Math.min((user.currentUsage / user.limit) * 100, 100)}%`
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500">
                                {((user.currentUsage / user.limit) * 100).toFixed(1)}% used
                            </p>
                        </div>
                {/* User Section */}
                {loggedIn && (
                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <span className="text-sm font-medium text-cyan-400">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-100 truncate">{user.name}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={toggleMenu}
                                    className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl py-1 overflow-hidden">
                                        <button 
                                            className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2" 
                                            onClick={handleLogoutWithClose}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                        <button 
                                            className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2" 
                                            onClick={handleLogoutAllWithClose}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout All
                                        </button>
                                        {!user.hasPassword && (
                                            <button 
                                                className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2" 
                                                onClick={handleSetPasswordWithClose}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                                Set Password
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Toolbar */}
                <Toolbar
                    nameArray = {routesNameArray}
                    idArray = {routesIdArray}
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
                        onConfirm={() =>
                            uploadFileToServer(
                                buildParentIdFromPath(dirPath),
                                file ? file.name : ""
                            )
                        }
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
                {shareModalOpen && shareItem && (
                    <ShareModal
                        item={shareItem}
                        onClose={handleCloseShareModal}
                        userRole={
                            user.userType || user.role || user.accountType
                        }
                        onShareUser={handleShareUser}
                        onUpdateShare={handleUpdateShare}
                        onRemoveShare={handleRemoveShare}
                        onEnableLinkShare={handleEnableLinkShare}
                        onDisableLinkShare={handleDisableLinkShare}
                        onUpdateLinkPermission={handleUpdateLinkPermission}
                    />
                )}
            </div>

            {/* Messages */}
            {message && (
                <div className="mx-6 mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300">
                    {message}
                </div>
            )}

            <div className="px-6 py-6">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-zinc-400">
                            <div className="w-5 h-5 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin"></div>
                            <span className="text-sm">Loading...</span>
                        </div>
                    </div>
                )}
                {noFilesMsg && (
                    <div className="flex items-center justify-center py-12 text-zinc-500 text-sm">
                        {noFilesMsg}
                    </div>
                )}
                
                {/* Folders Section - Grid Layout */}
                {(dirItems.directories.length > 0 || (googleDriveConnected && !routesDisplay.startsWith("/Google Drive"))) && (
                    <div className="mb-8">
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 px-2">Folders</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {googleDriveConnected && !routesDisplay.startsWith("/Google Drive") && (
                                <div
                                    key="google-drive"
                                    className="group relative bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setRoutesDisplay("/Google Drive");
                                        listGoogleDriveContent();
                                    }}
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-100">Google Drive</p>
                                            <p className="text-xs text-zinc-500 mt-1">Cloud Storage</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {dirItems.directories.map((dir) => {
                                const isDrive = dir.source && dir.source === "drive";
                                const id = dir._id || dir.id;
                                const linkHref = `/directory/${id}`;
                                const canViewShare = user.userType === "Owner" || user.userType === "Admin" || user.role === "Owner" || user.role === "Admin" || user.accountType === "Owner" || user.accountType === "Admin";
                                
                                return (
                                    <div
                                        key={id}
                                        className="group relative bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all"
                                    >
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                            <div className="w-full">
                                                {isDrive ? (
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setRoutesDisplay((prev) => prev ? prev + `/${dir.name}` : `/${dir.name}`);
                                                            fetchGoogleDriveFolder(id);
                                                        }}
                                                        className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors block truncate"
                                                    >
                                                        {dir.name}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={linkHref}
                                                        onClick={() => {
                                                            setRoutesDisplay(prev => prev? prev+dirPath.replace("/directory"): dirPath.replace("/directory"))
                                                        }}
                                                        className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors block truncate"
                                                    >
                                                        {dir.name}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {!isDrive && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleRenameBox(dir.name);
                                                        }}
                                                        className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
                                                        title="Rename"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    {canViewShare && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleOpenShareModal(dir, "folder");
                                                            }}
                                                            className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
                                                            title="Share"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            deleteItem(dir.pDir || null, id);
                                                        }}
                                                        className="p-1.5 rounded-md bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div
                className="pointer-events-none absolute z-20 mt-2 w-64 origin-top-right scale-95 translate-y-1 rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 text-xs text-zinc-200 opacity-0 shadow-xl shadow-black/30 backdrop-blur-sm transition duration-150 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                
            >
                
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Size
                    </span>
                    <span className="text-zinc-100">
                        {formatSize(dir.size)}
                    </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Path
                    </span>
                    <span className="text-zinc-100">
                        {routesNameArray.map(name => name.startsWith("root") ? "root" : name).join("/")}/{dir.name}
                    </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Created
                    </span>
                    <span className="text-zinc-100">
                        {formatDate(dir.createdAt)}
                    </span>
                </div>
            </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Files Section - List Layout */}
                {dirItems.files.length > 0 && (
                    <div>
                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 px-2">Files</h2>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="divide-y divide-zinc-800">
                                {dirItems.files.map((f) => (
                                    <FileRow
                                        key={f._id || f.id}
                                        file={f}
                                        baseUrl={BASE_URL}
                                        onToggleRename={toggleRenameBox}
                                        onRename={renameItem}
                                        onDelete={deleteItem}
                                        onShare={handleOpenShareModal}
                                        userRole={
                                            user.userType ||
                                            user.role ||
                                            user.accountType
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && dirItems.directories.length === 0 && dirItems.files.length === 0 && !noFilesMsg && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg className="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <p className="text-sm text-zinc-400 mb-1">No files or folders to display</p>
                        <p className="text-xs text-zinc-600">Upload files or create a folder to get started</p>
                    </div>
                )}
            </div>
            </div>
            </div>
    );
}

export default DirectoryUI;
