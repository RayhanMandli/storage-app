import { useState } from "react";

/**
 * LinkShareSection - UI for managing link-based sharing
 * 
 * Props:
 * - linkShare: { enabled, token, permission } | null
 * - canEdit: boolean
 * - onEnableLinkShare: (permission) => Promise<void>
 * - onDisableLinkShare: () => Promise<void>
 * - onUpdateLinkPermission: (permission) => Promise<void>
 * - isProcessing: boolean
 */
export default function LinkShareSection({
    linkShare,
    canEdit,
    onEnableLinkShare,
    onDisableLinkShare,
    onUpdateLinkPermission,
    isProcessing,
}) {
    const [linkPermission, setLinkPermission] = useState("viewer");
    const [copySuccess, setCopySuccess] = useState(false);

    const isEnabled = linkShare && linkShare.enabled;
    const shareToken = linkShare?.token;
    const currentLinkPermission = linkShare?.permission || "viewer";
    const BASE_URL = "http://localhost:4000";
    const shareLink = shareToken ? `${BASE_URL}/share/${shareToken}` : "";

    const handleEnableLink = async () => {
        try {
            await onEnableLinkShare(linkPermission);
        } catch (err) {
            console.error("Failed to enable link sharing:", err);
        }
    };

    const handleDisableLink = async () => {
        if (window.confirm("Disable link sharing? The current link will stop working.")) {
            try {
                await onDisableLinkShare();
            } catch (err) {
                console.error("Failed to disable link sharing:", err);
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleLinkPermissionChange = (e) => {
        const newPermission = e.target.value;
        onUpdateLinkPermission(newPermission);
    };

    return (
        <div className="share-section">
            <h3 className="share-section-title">Link sharing</h3>

            {!isEnabled ? (
                <div className="link-share-disabled">
                    <p className="link-share-description">
                        Anyone with the link can access this {linkShare?.itemType || "item"}
                    </p>
                    {canEdit && (
                        <div className="link-share-enable-group">
                            <select
                                className="share-select"
                                value={linkPermission}
                                onChange={(e) => setLinkPermission(e.target.value)}
                                disabled={isProcessing}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                            <button
                                className="toolbar-btn"
                                onClick={handleEnableLink}
                                disabled={isProcessing}
                            >
                                Enable Link Sharing
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="link-share-enabled">
                    <div className="link-share-url-group">
                        <input
                            type="text"
                            className="share-link-input"
                            value={shareLink}
                            readOnly
                        />
                        <button
                            className="toolbar-btn copy-btn"
                            onClick={handleCopyLink}
                            title="Copy link"
                        >
                            {copySuccess ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                    <div className="link-share-controls">
                        <div className="link-permission-group">
                            <span className="link-permission-label">Link permission:</span>
                            <select
                                className="share-select-small"
                                value={currentLinkPermission}
                                onChange={handleLinkPermissionChange}
                                disabled={!canEdit || isProcessing}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                        {canEdit && (
                            <button
                                className="action-btn danger-btn"
                                onClick={handleDisableLink}
                                disabled={isProcessing}
                            >
                                Disable Link Sharing
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
