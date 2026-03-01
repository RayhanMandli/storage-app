// DirectoryRow - renders a single directory entry. Keeps action button labels & ordering.
// Accepts callbacks referencing original logic in parent; no backend changes.
import { Link } from "react-router-dom";

export default function DirectoryRow({
  dir,
  onEnterLocal,
  onEnterDrive,
  onToggleRename,
  onRename,
  onDelete,
  onShare,
  userRole,
  readOnly = false,
  linkBuilder,
}) {
  const isDrive = dir.source && dir.source === "drive";
  const id = dir._id || dir.id;
  const linkHref = linkBuilder ? linkBuilder(id) : `/directory/${id}`;
  
  // Show share button for Owner and Admin roles
  const canViewShare = userRole === "Owner" || userRole === "Admin";

  return (
    <tr key={id} className="group hover:bg-zinc-800/50 transition-colors">
      <td className="px-4 py-3">
        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </td>
      <td className="px-4 py-3">
        {isDrive ? (
          <a
            href="#"
            className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors"
            onClick={(e) => { e.preventDefault(); onEnterDrive(id, dir.name); }}
          >
            {dir.name}
          </a>
        ) : (
          <Link
            className="text-sm font-medium text-zinc-100 hover:text-cyan-400 transition-colors"
            to={linkHref}
            onClick={() => onEnterLocal(dir.name)}
          >
            {dir.name}
          </Link>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-zinc-400">Folder</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isDrive && !readOnly && (
            <>
              <button 
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors" 
                onClick={() => onToggleRename(dir.name)}
              >
                Rename
              </button>
              <button 
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors" 
                onClick={() => onRename(dir.name, id, "folder")}
              >
                Save
              </button>
              <button 
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors" 
                onClick={() => onDelete(dir.pDir || null, id)}
              >
                Delete
              </button>
            </>
          )}
          {!isDrive && canViewShare && onShare && (
            <button 
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-300 rounded-md hover:bg-zinc-700 hover:text-zinc-100 transition-colors" 
              onClick={() => onShare(dir, "folder")}
            >
              Share
            </button>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-zinc-500">{dir.modified || dir.createdAt || ""}</td>
    </tr>
  );
}
