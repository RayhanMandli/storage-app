// FileRow - renders file entry maintaining download, rename, delete sequence.
export default function FileRow({
    file,
    baseUrl,
    onToggleRename,
    onRename,
    onDelete,
    onShare,
    userRole,
    readOnly = false,
}) {
    const isDrive = file.source && file.source === "drive";
    const id = file._id || file.id;
    const name = file.name || file.filename;
    const fileType =
        file.type ||
        file.filetype ||
        file.mimeType ||
        file.mimetype ||
        file.extension ||
        "Unknown";
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
    const isSharedBySomeoneElse = file.sharedBy && file.sharedBy !== "self";
    const downloadHref = isDrive
        ? `${baseUrl}/integrations/drive/file/download/${id}?action=download`
        : `${baseUrl}/files/${id}?action=download`;
    const viewHref = isDrive
        ? `${baseUrl}/integrations/drive/file/download/${id}`
        : `${baseUrl}/files/${id}`;

    // Show share button for Owner and Admin roles
    const canViewShare = true;
    return (
        <div className="group relative flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 transition-colors ">
            <div className="flex-shrink-0">
                <svg
                    className="w-8 h-8 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <div className="relative inline-block group/file-name">
                    <a
                        className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors truncate"
                        href={viewHref}
                        target="_blank"
                    >
                        {name}
                    </a>
                    {isSharedBySomeoneElse && (
                        <svg
                            className="flex-shrink-0 w-4 h-4 text-cyan-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            title="Shared by another user"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                    {formatDate(file.createdAt)}
                </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isDrive && !readOnly && (
                    <>
                        <button
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
                            onClick={() => onToggleRename(name)}
                        >
                            Rename
                        </button>
                        <button
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                            onClick={() => onRename(name, id, "file")}
                        >
                            Save
                        </button>
                        <button
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            onClick={() =>
                                onDelete(file.pDir || null, id, "file")
                            }
                        >
                            Delete
                        </button>
                    </>
                )}
                {!isDrive && canViewShare && onShare && (
                    <button
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
                        onClick={() => onShare(file, "file")}
                    >
                        Share
                    </button>
                )}
                <a
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
                    href={downloadHref}
                >
                    Download
                </a>
            </div>
            <div
                className="pointer-events-none absolute z-20 mt-2 w-64 origin-top-right scale-95 translate-y-1 rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 text-xs text-zinc-200 opacity-0 shadow-xl shadow-black/30 backdrop-blur-sm transition duration-150 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                style={{
                    left: name.includes("_")?Math.min(name.length * 10, 550): Math.min(name.length * 9.5, 550),
                }}
            >
                <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Type
                    </span>
                    <span className="text-zinc-100">{fileType}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Size
                    </span>
                    <span className="text-zinc-100">
                        {formatSize(file.filesize)}
                    </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wide">
                        Created
                    </span>
                    <span className="text-zinc-100">
                        {formatDate(file.createdAt || file.created)}
                    </span>
                </div>
            </div>
        </div>
    );
}
