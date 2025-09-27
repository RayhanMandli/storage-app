import { useEffect, useState } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function DirectoryUI() {
  const BASE_URL = "http://192.168.83.137:4000";
  const [dirItems, setDirItems] = useState([]);
  const [renameBox, setRenameBox] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const { "*": dirPath } = useParams();

  async function handleDelete(name) {
    const res = await fetch(`${BASE_URL}/files/${name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath: dirPath }),
    });
    const data = await res.json();
    console.log('data: ', data);
    setDirItems((prevItems) => prevItems.filter((item) => item.name !== name));
  }
  async function handleRename(oldname) {
    if (!renameBox) return;
    if (oldname === renameBox) return;
    const res = await fetch(`${BASE_URL}/files/${oldname}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newFileName: renameBox, filePath: dirPath }),
    });
    const data = await res.json();
    console.log('data: ', data);
    setIsRenaming(false);
    setRenameBox("");
    setDirItems((prevItems) =>
      prevItems.map((item) =>
        item.name === oldname ? { ...item, name: renameBox } : item
      )
    );
  }

  const toggleRenameBox = (oldname) => {
    setIsRenaming(!isRenaming);
    setRenameBox(oldname);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/${dirPath}`);
      const data = await res.json();
      console.log('data: ', data);
      setDirItems(data);
    };
    fetchData();
  }, [dirPath]);

  return (
    <div className="explorer-container">
      <div className="explorer-toolbar">
        <button className="toolbar-btn">New Folder</button>
        <button className="toolbar-btn">Upload</button>
        <span className="explorer-path">{dirPath || "Root"}</span>
      </div>
      {isRenaming && (
        <div className="rename-box">
          <input
            value={renameBox}
            onChange={(e) => setRenameBox(e.target.value)}
            className="rename-input"
          />
          <button className="toolbar-btn" onClick={() => setIsRenaming(false)}>
            Cancel
          </button>
        </div>
      )}
      <div className="explorer-table-wrapper">
        <table className="explorer-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dirItems.map(({ name, isDir }, i) => (
              <tr key={i}>
                <td>
                  {isDir ? (
                    <span role="img" aria-label="folder">
                      📁
                    </span>
                  ) : (
                    <span role="img" aria-label="file">
                      📄
                    </span>
                  )}
                </td>
                <td className="file-name">
                  {isDir ? (
                    <Link to={`/${dirPath || "directory"}/${name}`}>
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                </td>
                <td>{isDir ? "Folder" : "File"}</td>
                <td>
                  {isDir ? (
                    <Link
                      className="action-btn"
                      to={`/${dirPath || "directory"}/${name}`}
                    >
                      Open
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="action-btn"
                        to={`${BASE_URL}/files/${dirPath}/${name}`}
                      >
                        Open
                      </Link>
                      <Link
                        className="action-btn"
                        to={`${BASE_URL}/files/${dirPath}/${name}?action=download`}
                      >
                        Download
                      </Link>
                      <button
                        className="action-btn"
                        onClick={() => toggleRenameBox(name)}
                      >
                        Rename
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleRename(name)}
                      >
                        Save
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDelete(name)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DirectoryUI;
