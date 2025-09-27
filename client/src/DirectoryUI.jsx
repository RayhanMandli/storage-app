import { useEffect, useState } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function DirectoryUI() {
  const BASE_URL = "http://192.168.83.137:4000";
  const [dirItems, setDirItems] = useState([]);
  const [renameBox, setRenameBox] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [message, setMessage] = useState("");
  const [noFilesMsg, setNoFilesMsg] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [foldername, setFoldername] = useState("");
  const { "*": dirPath } = useParams();

  const handleDelete = async (name) => {
    const res = await fetch(`${BASE_URL}/delete/${name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath: dirPath }),
    });
    const data = await res.json();
    console.log("data: ", data);
    setDirItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };
  const handleRename = async (oldname) => {
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
    console.log("data: ", data);
    setIsRenaming(false);
    setRenameBox("");
    setDirItems((prevItems) =>
      prevItems.map((item) =>
        item.name === oldname ? { ...item, name: renameBox } : item
      )
    );
  };

  const toggleRenameBox = (oldname) => {
    setIsRenaming(!isRenaming);
    setRenameBox(oldname);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const response = await fetch(`${BASE_URL}/upload/${dirPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Filename": file.name, // optional: send original file name
        },
        body: file, // sending raw file
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setIsUploading(false);
      } else {
        setMessage("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
    }
  };

  const handleFolderCreation = async () => {
    if (!foldername) return;

    try {
      const response = await fetch(`${BASE_URL}/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foldername, dirPath }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIsCreating(false);
        fetchData();
      } else {
        console.log("Unable to create directory");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    const res = await fetch(`${BASE_URL}/${dirPath}`);
    const data = await res.json();
    if (data.length === 0) {
      setNoFilesMsg("No Files");
    }
    console.log("data: ", data);
    setDirItems(data);
  };
  useEffect(() => {
    fetchData();
  }, [dirPath]);

  return (
    <div className="explorer-container">
      <div className="explorer-toolbar">
        <button
          className="toolbar-btn"
          onClick={() => setIsCreating(!isCreating)}
        >
          New Folder
        </button>
        <button
          className="toolbar-btn"
          onClick={() => setIsUploading(!isUploading)}
        >
          Upload
        </button>
        <span className="explorer-path">{dirPath || "Root"}</span>
      </div>
      {isCreating && (
        <div className="rename-box">
          <input
            placeholder="Enter Directory Name"
            type="text"
            onChange={(e) => setFoldername(e.target.value)}
            className="rename-input"
          />
          <button className="toolbar-btn" onClick={handleFolderCreation}>
            Ok
          </button>
          <button className="toolbar-btn" onClick={() => setIsUploading(false)}>
            Cancel
          </button>
        </div>
      )}
      {isUploading && (
        <div className="rename-box">
          <input
            type="file"
            onChange={handleFileChange}
            className="rename-input"
          />
          <button className="toolbar-btn" onClick={handleFileUpload}>
            Ok
          </button>
          <button className="toolbar-btn" onClick={() => setIsUploading(false)}>
            Cancel
          </button>
        </div>
      )}
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
      {message && <span>{message}</span>}
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
            {noFilesMsg && <div className="no-file-msg">{noFilesMsg}</div>}
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
                    <>
                    <Link
                      className="action-btn"
                      to={`/${dirPath || "directory"}/${name}`}
                    >
                      Open
                    </Link>
                    <button
                        className="action-btn"
                        onClick={() => handleDelete(name)}
                      >
                        Delete
                      </button>
                    </>
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
