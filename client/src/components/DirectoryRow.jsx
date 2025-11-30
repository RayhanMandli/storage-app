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
}) {
  const isDrive = dir.source && dir.source === "drive";
  const id = dir._id || dir.id;
  return (
    <tr key={id}>
      <td><span role="img" aria-label="folder">📁</span></td>
      <td className="file-name">
        {isDrive ? (
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterDrive(id, dir.name); }}>
            {dir.name}
          </a>
        ) : (
          <Link to={`/directory/${id}`} onClick={() => onEnterLocal(dir.name)}>{dir.name}</Link>
        )}
      </td>
      <td>Folder</td>
      <td>
        {!isDrive && (
          <>
            <button className="action-btn" onClick={() => onToggleRename(dir.name)}>Rename</button>
            <button className="action-btn" onClick={() => onRename(dir.name, id, "folder")}>Save</button>
            <button className="action-btn" onClick={() => onDelete(dir.pDir || null, id)}>Delete</button>
          </>
        )}
      </td>
      <td>{dir.modified || dir.createdAt || ""}</td>
    </tr>
  );
}
