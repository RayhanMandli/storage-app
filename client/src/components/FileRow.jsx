// FileRow - renders file entry maintaining download, rename, delete sequence.
export default function FileRow({ file, baseUrl, onToggleRename, onRename, onDelete }) {
  const isDrive = file.source && file.source === "drive";
  const id = file._id || file.id;
  const name = file.name || file.filename;
  const downloadHref = isDrive ? `${baseUrl}/integrations/drive/file/download/${id}?action=download` : `${baseUrl}/files/${id}?action=download`;
  const viewHref = isDrive ? `${baseUrl}/integrations/drive/file/download/${id}` : `${baseUrl}/files/${id}`;
  return (
    <tr key={id}>
      <td><span role="img" aria-label="file">📄</span></td>
      <td className="file-name">
        <a href={viewHref}>{name}</a>
      </td>
      <td>File</td>
      <td>
        {!isDrive && (
          <>
            <button className="action-btn" onClick={() => onToggleRename(name)}>Rename</button>
            <button className="action-btn" onClick={() => onRename(name, id, "file")}>Save</button>
            <button className="action-btn" onClick={() => onDelete(file.pDir || null, id, "file")}>Delete</button>
          </>
        )}
        <a className="action-btn" href={downloadHref}>Download</a>
      </td>
      <td>{file.modified || file.createdAt || ""}</td>
    </tr>
  );
}
