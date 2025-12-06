// FileRow - renders file entry maintaining download, rename, delete sequence.
export default function FileRow({ 
  file, 
  baseUrl, 
  onToggleRename, 
  onRename, 
  onDelete, 
  onShare,
  userRole,
  readOnly = false 
}) {
  const isDrive = file.source && file.source === "drive";
  const id = file._id || file.id;
  const name = file.name || file.filename;
  const isSharedBySomeoneElse = file.sharedBy && file.sharedBy !== "self";
  const downloadHref = isDrive ? `${baseUrl}/integrations/drive/file/download/${id}?action=download` : `${baseUrl}/files/${id}?action=download`;
  const viewHref = isDrive ? `${baseUrl}/integrations/drive/file/download/${id}` : `${baseUrl}/files/${id}`;
  
  // Show share button for Owner and Admin roles
  const canViewShare = true;

  return (
    <tr key={id}>
      <td><span role="img" aria-label="file">📄</span></td>
      <td className="file-name">
        <a href={viewHref}>{name}</a>
        {isSharedBySomeoneElse && <span title="Shared by another user" style={{ marginLeft: 8 }}>🔗</span>}
      </td>
      <td>File</td>
      <td>
        {!isDrive && !readOnly && (
          <>
            <button className="action-btn" onClick={() => onToggleRename(name)}>Rename</button>
            <button className="action-btn" onClick={() => onRename(name, id, "file")}>Save</button>
            <button className="action-btn" onClick={() => onDelete(file.pDir || null, id, "file")}>Delete</button>
          </>
        )}
        {!isDrive && canViewShare && onShare && (
          <button className="action-btn" onClick={() => onShare(file, "file")}>Share</button>
        )}
        <a className="action-btn" href={downloadHref}>Download</a>
      </td>
      <td>{file.modified || file.createdAt || ""}</td>
    </tr>
  );
}
