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
}) {
  return (
    <div className="explorer-toolbar">
      <div className="btn-group">
        <Link style={{color: "gray", fontSize: "12px"}} to="/users">See Users</Link>
        <button className="toolbar-btn" onClick={onNewFolderToggle}>New Folder</button>
        <button className="toolbar-btn" onClick={onUploadToggle}>Upload</button>
        {showDriveConnect && (
          <button className="toolbar-btn" onClick={onDriveConnect}>Connect Google Drive</button>
        )}
      </div>
      <span className="explorer-path">{currentPathLabel}</span>
      <div>
        {loggedIn ? (
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{ fontSize: "13px", color: "#616161" }}>{userName}</span>
            <button className="toolbar-btn" onClick={onLogout}>Logout</button>
            <button className="toolbar-btn" onClick={onLogoutAll}>Logout All</button>
          </div>
        ) : (
          // Keep original Login link structure. Parent still provides routing via react-router.
          <a href="/login" className="toolbar-btn">Login</a>
        )}
      </div>
    </div>
  );
}
