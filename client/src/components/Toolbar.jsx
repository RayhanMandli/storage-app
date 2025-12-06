// Pure presentational toolbar component.
// Receives only UI related props & callbacks. All logic/state lives in parent.

import { Link } from "react-router-dom";

// IMPORTANT: Does not alter any backend interaction. Buttons call through provided handlers.
export default function Toolbar({
    onNewFolderToggle,
    onUploadToggle,
    showDriveConnect,
    onDriveConnect,
    currentPathLabel,
    loggedIn,
    userName,
    onLogout,
    onLogoutAll,
    onSetPassword,
    isMenuOpen,
    onMenuToggle,
    showNewFolder = true,
    showUpload = true,
    userHasPassword = false, // New prop to indicate if user has a password
}) {
    return (
        <div className="explorer-toolbar">
            <div className="btn-group">
                <Link style={{ color: "gray", fontSize: "12px" }} to="/users">
                    See Users
                </Link>
                {showNewFolder && (
                    <button className="toolbar-btn" onClick={onNewFolderToggle}>
                        New Folder
                    </button>
                )}
                {showUpload && (
                    <button className="toolbar-btn" onClick={onUploadToggle}>
                        Upload
                    </button>
                )}
                {showDriveConnect && (
                    <button className="toolbar-btn" onClick={onDriveConnect}>
                        Connect Google Drive
                    </button>
                )}
            </div>
            <span className="explorer-path">{currentPathLabel}</span>
            <div>
                {loggedIn ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <span style={{ fontSize: "13px", color: "#616161" }}>
                            {userName}
                        </span>
                        <div style={{ position: "relative" }}>
                            <button
                                className="toolbar-btn"
                                aria-haspopup="true"
                                aria-expanded={Boolean(isMenuOpen)}
                                onClick={onMenuToggle}
                            >
                                ⋮
                            </button>
                            {isMenuOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "100%",
                                        marginTop: "4px",
                                        background: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                        display: "flex",
                                        flexDirection: "column",
                                        minWidth: "140px",
                                        zIndex: 10,
                                    }}
                                >
                                    <button
                                        className="toolbar-btn"
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                        }}
                                        onClick={onLogout}
                                    >
                                        Logout
                                    </button>
                                    <button
                                        className="toolbar-btn"
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                        }}
                                        onClick={onLogoutAll}
                                    >
                                        Logout All
                                    </button>
                                    {!userHasPassword && (
                                        <button
                                            className="toolbar-btn"
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                            }}
                                            onClick={onSetPassword}
                                        >
                                            Set Password
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Keep original Login link structure. Parent still provides routing via react-router.
                    <a href="/login" className="toolbar-btn">
                        Login
                    </a>
                )}
            </div>
        </div>
    );
}
