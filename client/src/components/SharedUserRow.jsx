/**
 * SharedUserRow - displays a single shared user with permission controls
 * 
 * Props:
 * - user: { _id or userId, email or username, permission }
 * - canEdit: boolean
 * - onUpdatePermission: (userId, newPermission) => Promise<void>
 * - onRemove: (userId) => Promise<void>
 * - isProcessing: boolean
 */
export default function SharedUserRow({
    user,
    canEdit,
    onUpdatePermission,
    onRemove,
    isProcessing,
}) {
    const userId = user._id || user.userId;
    const displayName = user.email || user.username || "Unknown User";
    const currentPermission = user.permission || "viewer";

    const handlePermissionChange = (e) => {
        const newPermission = e.target.value;
        onUpdatePermission(userId, newPermission);
    };

    const handleRemove = () => {
        if (window.confirm(`Remove access for ${displayName}?`)) {
            onRemove(userId);
        }
    };

    return (
        <div className="shared-user-row">
            <div className="shared-user-info">
                <span className="shared-user-icon" role="img" aria-label="user">
                    👤
                </span>
                <span className="shared-user-name">{displayName}</span>
            </div>
            <div className="shared-user-actions">
                <select
                    className="share-select-small"
                    value={currentPermission}
                    onChange={handlePermissionChange}
                    disabled={!canEdit || isProcessing}
                >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                </select>
                {canEdit && (
                    <button
                        className="action-btn share-remove-btn"
                        onClick={handleRemove}
                        disabled={isProcessing}
                        title="Remove access"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
} 
