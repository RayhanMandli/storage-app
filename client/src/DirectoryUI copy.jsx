import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DirectoryContext } from "./contexts/DirectoryContexts";
import { useContext } from "react";

function DirectoryUI() {
    const { routesDisplay, setRoutesDisplay } = useContext(DirectoryContext);
    const BASE_URL = "http://localhost:4000";
    const [dirItems, setDirItems] = useState([]);
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

    let { "*": dirPath } = useParams();
    const navigate = useNavigate();
    //utility functions
    const toggleRenameBox = (oldname) => {
        setIsRenaming(!isRenaming);
        setRenameBox(oldname);
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    //apis calling
    const handleDelete = async (pId, fileId, type) => {
        const res = await fetch(
            `${BASE_URL}/delete/${fileId}${
                type === "file" ? "?type=file" : ""
            }`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    parentdirid: pId,
                },
                credentials: "include",
            }
        );
        const data = await res.json();
        setMessage(data.message);
        fetchData();
    };
    const handleRename = async (oldname, Id, type) => {
        if (!renameBox) return;
        if (oldname === renameBox) return;
        const res = await fetch(
            `${BASE_URL}/${type === "file" ? "files" : "directory"}/${Id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ newName: renameBox }),
            }
        );
        const data = await res.json();
        setIsRenaming(false);
        setRenameBox("");
        fetchData();
    };
    const handleFileUpload = async (pId, filename) => {
        if (!pId) pId = "root";
        if (!file) return;
        setMessage("");
        setIsUploading(true);
        try {
            const response = await fetch(`${BASE_URL}/upload/${filename}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                    parentdirid: pId,
                },
                credentials: "include",
                body: file, // sending raw file
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                setIsUploading(false);
                fetchData();
            } else {
                setMessage("Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("Error uploading file");
        }
    };
    const handleFolderCreation = async () => {
        if (!foldername) return;

        try {
            const response = await fetch(
                `${BASE_URL}/directory/${foldername}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        parentdirid:
                            dirPath !== "directory" && dirPath
                                ? dirPath.replace("directory/", "")
                                : "root",
                    },
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setIsCreating(false);
                fetchData();
            } else {
                console.log("Unable to create directory");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchData = async () => {
        const res = await fetch(
            `${BASE_URL}/${dirPath ? dirPath : "directory"}`,
            {
                credentials: "include",
            }
        );
        const data = await res.json();

        if (res.status === 401) {
            navigate("/login");
            return;
        }

        if (data.files.length === 0 && data.directories.length === 0) {
            setNoFilesMsg("No Files");
        }
        setDirItems(data);
    };
    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setLoggedIn(false);
                setUser({});
                navigate("/login");
            } else {
                console.error("Failed to logout");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    const handleLogoutAll = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/all-logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setLoggedIn(false);
                setUser({});
                navigate("/login");
            } else {
                console.error("Failed to logout");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    const handleDriveConnect = () => {
        const params = new URLSearchParams({
            client_id:
                "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com",
            redirect_uri:
                "http://localhost:4000/integrations/google-drive/callback",
            response_type: "code",
            access_type: "offline", // IMPORTANT → gives refresh_token
            scope: "https://www.googleapis.com/auth/drive.readonly",
            prompt: "consent", // ensures refresh_token on every request
        });

        window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
        setGoogleDriveConnected(true);
    };
    const listGoogleDriveContent = async () => {
        const response = await fetch(
            `${BASE_URL}/integrations/drive/list-root`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        setDirItems(data);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setLoggedIn(true);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [BASE_URL]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirPath]);

    return (
        <div className="explorer-container">
            <div className="explorer-toolbar">
                <div className="btn-group">
                    <button
                        className="toolbar-btn"
                        onClick={() => setIsCreating(!isCreating)}
                    >
                        New Folder
                    </button>
                    <button
                        className="toolbar-btn"
                        onClick={() => setIsUploading(!isUploading)}
                    >
                        Upload
                    </button>
                    <button
                        className="toolbar-btn"
                        onClick={handleDriveConnect}
                    >
                        Connect Google Drive
                    </button>
                </div>
                <span className="explorer-path">{routesDisplay || "/"}</span>
                <div>
                    {loggedIn ? (
                        <div>
                            <span
                                style={{ fontSize: "13px", color: "#616161" }}
                            >
                                {user.name}
                            </span>
                            <button
                                className="toolbar-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <button
                                className="toolbar-btn"
                                onClick={handleLogoutAll}
                            >
                                Logout All
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="toolbar-btn">
                            Login
                        </Link>
                    )}
                </div>
            </div>
            <div>
                {isCreating && (
                    <div className="rename-box">
                        <input
                            placeholder="Enter Directory Name"
                            type="text"
                            onChange={(e) => setFoldername(e.target.value)}
                            className="rename-input"
                        />
                        <button
                            className="toolbar-btn"
                            onClick={handleFolderCreation}
                        >
                            Ok
                        </button>
                        <button
                            className="toolbar-btn"
                            onClick={() => setIsUploading(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
                {isUploading && (
                    <div className="rename-box">
                        <div>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="rename-input"
                            />
                            <button
                                className="toolbar-btn"
                                onClick={() =>
                                    handleFileUpload(
                                        dirPath !== "directory" && dirPath
                                            ? dirPath.replace("directory/", "")
                                            : "root",
                                        file ? file.name : ""
                                    )
                                }
                            >
                                Ok
                            </button>
                            <button
                                className="toolbar-btn"
                                onClick={() => setIsUploading(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {isRenaming && (
                    <div className="rename-box">
                        <input
                            value={renameBox}
                            onChange={(e) => setRenameBox(e.target.value)}
                            className="rename-input"
                        />
                        <button
                            className="toolbar-btn"
                            onClick={() => setIsRenaming(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            {message && <span>{message}</span>}
            <div className="explorer-table-wrapper">
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
                        {
                            <tr key={"google-drive"}>
                                <td>
                                    <span role="img" aria-label="folder">
                                        📁
                                    </span>
                                </td>
                                <td className="file-name">
                                    <Link onClick={listGoogleDriveContent}>
                                        Google Drive
                                    </Link>
                                </td>
                                <td> Folder </td>
                            </tr>
                        }
                        {dirItems?.directories?.map(
                            ({ pDir, name, _id: id }, i) => (
                                <tr key={i}>
                                    <td>
                                        <span role="img" aria-label="folder">
                                            📁
                                        </span>
                                    </td>
                                    <td className="file-name">
                                        <Link
                                            to={`/directory/${id}`}
                                            onClick={() =>
                                                setRoutesDisplay(
                                                    (prevRoute) =>
                                                        prevRoute + `/${name}`
                                                )
                                            }
                                        >
                                            {name}
                                        </Link>
                                    </td>
                                    <td> Folder </td>
                                    <td>
                                        <>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    toggleRenameBox(name)
                                                }
                                            >
                                                Rename
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    handleRename(
                                                        name,
                                                        id,
                                                        "folder"
                                                    )
                                                }
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    handleDelete(pDir, id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    </td>
                                </tr>
                            )
                        )}
                        {dirItems?.files?.map(
                            ({ name: filename, _id: id, pDir }, i) => (
                                <tr key={i}>
                                    <td>
                                        <span role="img" aria-label="file">
                                            📄
                                        </span>
                                    </td>
                                    <td className="file-name">
                                        <Link to={`${BASE_URL}/files/${id}`}>
                                            {filename}
                                        </Link>
                                    </td>
                                    <td> File </td>
                                    <td>
                                        <>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    toggleRenameBox(filename)
                                                }
                                            >
                                                Rename
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    handleRename(
                                                        filename,
                                                        id,
                                                        "file"
                                                    )
                                                }
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        pDir,
                                                        id,
                                                        "file"
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                className="action-btn"
                                                to={`${BASE_URL}/files/${id}?action=download`}
                                            >
                                                Download
                                            </Link>
                                        </>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DirectoryUI;
