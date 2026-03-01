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
        <div className="px-5 py-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Link sharing</h3>

            {!isEnabled ? (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Anyone with the link can access this {linkShare?.itemType || "item"}
                    </p>
                    {canEdit && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <select
                                className="h-10 rounded border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={linkPermission}
                                onChange={(e) => setLinkPermission(e.target.value)}
                                disabled={isProcessing}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                            <button
                                className="h-10 px-4 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                                onClick={handleEnableLink}
                                disabled={isProcessing}
                            >
                                Enable Link Sharing
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm bg-gray-50"
                            value={shareLink}
                            readOnly
                        />
                        <button
                            className="h-10 px-4 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                            onClick={handleCopyLink}
                            title="Copy link"
                        >
                            {copySuccess ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Link permission:</span>
                            <select
                                className="h-10 rounded border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
                                className="h-9 px-4 rounded border border-red-200 bg-red-50 text-sm font-semibold text-red-700 hover:bg-red-100"
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
