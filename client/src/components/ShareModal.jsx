import { useState } from "react";
import "./ShareModal.css";
import SharedUserRow from "./SharedUserRow";
import LinkShareSection from "./LinkShareSection";

/**
 * ShareModal - UI for managing file/folder sharing
 * 
 * Props:
 * - item: { _id, name, sharedWith?, linkShare?, owner? }
 * - onClose: () => void
 * - userRole: 'Owner' | 'Admin' | other
 * - onShareUser: (email, permission) => Promise<void>
 * - onUpdateShare: (sharedUserId, newPermission) => Promise<void>
 * - onRemoveShare: (sharedUserId) => Promise<void>
 * - onEnableLinkShare: (permission) => Promise<void>
 * - onDisableLinkShare: () => Promise<void>
 * - onUpdateLinkPermission: (permission) => Promise<void>
 */
export default function ShareModal({
    item,
    onClose,
    userRole,
    onShareUser,
    onUpdateShare,
    onRemoveShare,
    onEnableLinkShare,
    onDisableLinkShare,
    onUpdateLinkPermission,
}) {
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState("viewer");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const isOwner = userRole === "owner";
    const isAdmin = userRole === "admin";
    const isUser = userRole === "user";
    const canEdit = isOwner; // Only Owner can edit shares
    const canView = isOwner || isAdmin || isUser; // Owner, Admin, and User can view shares

    const handleShare = async () => {
        if (!email.trim()) {
            setError("Please enter an email address");
            return;
        }
        setError("");
        setIsProcessing(true);
        try {
            await onShareUser(email.trim(), permission);
            setEmail("");
            setPermission("viewer");
        } catch (err) {
            setError(err.message || "Failed to share");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateShare = async (userId, newPerm) => {
        setError("");
        setIsProcessing(true);
        try {
            await onUpdateShare(userId, newPerm);
        } catch (err) {
            setError(err.message || "Failed to update permission");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveShare = async (userId) => {
        setError("");
        setIsProcessing(true);
        try {
            await onRemoveShare(userId);
        } catch (err) {
            setError(err.message || "Failed to remove share");
        } finally {
            setIsProcessing(false);
        }
    };

    const sharedUsers = Array.isArray(item.sharedWith) ? item.sharedWith : [];

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h2 className="share-modal-title">Share "{item.filename}"</h2>
                    <button className="share-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {error && <div className="share-modal-error">{error}</div>}

                {/* Share with user section */}
                {(
                    <div className="share-section">
                        <h3 className="share-section-title">Share with people</h3>
                        <div className="share-input-group">
                            <input
                                type="email"
                                className="share-input"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isProcessing}
                            />
                            <select
                                className="share-select"
                                value={permission}
                                onChange={(e) => setPermission(e.target.value)}
                                disabled={isProcessing}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                            <button
                                className="toolbar-btn share-btn"
                                onClick={handleShare}
                                disabled={isProcessing}
                            >
                                Share
                            </button>
                        </div>
                    </div>
                )}

                {/* Existing shared users */}
                {canView && sharedUsers.length > 0 && (
                    <div className="share-section">
                        <h3 className="share-section-title">People with access</h3>
                        <div className="shared-users-list">
                            {sharedUsers.map(({userId:user}) => (
                                <SharedUserRow
                                    key={user._id || user.userId}
                                    user={user}
                                    canEdit={canEdit}
                                    onUpdatePermission={handleUpdateShare}
                                    onRemove={handleRemoveShare}
                                    isProcessing={isProcessing}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Link sharing section */}
                {canView && (
                    <LinkShareSection
                        linkShare={item.linkShare}
                        canEdit={canEdit}
                        onEnableLinkShare={onEnableLinkShare}
                        onDisableLinkShare={onDisableLinkShare}
                        onUpdateLinkPermission={onUpdateLinkPermission}
                        isProcessing={isProcessing}
                    />
                )}

                {/* Admin view message */}
                {isAdmin && !isOwner && (
                    <div className="share-info-message">
                        <span role="img" aria-label="info">ℹ️</span>
                        You can view sharing information but cannot make changes.
                    </div>
                )}
            </div>
        </div>
    );
}
