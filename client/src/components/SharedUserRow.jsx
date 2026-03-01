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
        <div className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2">
                <span className="text-lg" role="img" aria-label="user">
                    👤
                </span>
                <span className="text-sm text-gray-900">{displayName}</span>
            </div>
            <div className="flex items-center gap-2">
                <select
                    className="h-9 rounded border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentPermission}
                    onChange={handlePermissionChange}
                    disabled={!canEdit || isProcessing}
                >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                </select>
                {canEdit && (
                    <button
                        className="h-9 px-3 rounded border border-red-200 bg-red-50 text-sm font-semibold text-red-700 hover:bg-red-100"
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
