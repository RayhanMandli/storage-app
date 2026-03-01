import { useState } from "react";
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
    const canEdit = isOwner; // Only Owner can edit shares
    const canView = true; // Owner, Admin, and User can view shares

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
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center" onClick={onClose}>
            <div className="w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-950 shadow-2xl shadow-black/50 outline-2 outline-cyan-600 outline-offset-2 outline-solid" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4">
                    <h2 className="text-lg font-semibold text-zinc-100">Share "{item.filename}"</h2>
                    <button className="h-9 w-9 rounded-full hover:bg-zinc-800 text-xl text-zinc-400 hover:text-zinc-200 transition-colors" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mx-5 mt-3 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="divide-y divide-zinc-800">
                    <div className="px-5 py-4 space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-200">Share with people</h3>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <input
                                type="email"
                                className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isProcessing}
                            />
                            <select
                                className="h-10 rounded border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                                value={permission}
                                onChange={(e) => setPermission(e.target.value)}
                                disabled={isProcessing}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                            <button
                                className="h-10 px-4 rounded bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={handleShare}
                                disabled={isProcessing}
                            >
                                Share
                            </button>
                        </div>
                    </div>

                    {canView && sharedUsers.length > 0 && (
                        <div className="px-5 py-4 space-y-3">
                            <h3 className="text-sm font-semibold text-zinc-200">People with access</h3>
                            <div className="flex flex-col gap-2">
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

                    {isAdmin && !isOwner && (
                        <div className="mx-5 my-4 flex items-center gap-2 rounded border border-cyan-900/50 bg-cyan-950/30 px-3 py-2 text-sm text-cyan-400">
                            <span role="img" aria-label="info">ℹ️</span>
                            You can view sharing information but cannot make changes.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
