import express from "express";
import { rm, writeFile } from "fs/promises";
import filesData from "../db/fileDB.json" with { type: "json" };
import directoriesData from "../db/directoryDB.json" with { type: "json" };

const router = express.Router();

const deleteFile = async (id, parentDirId, dirDelete) => {
  const file = filesData.find((f) => f.id === id);
  const { extension } = file;

  try {
    await rm(`./storage/${id}${extension}`, {
      force: true,
    });

    filesData.splice(filesData.indexOf(file), 1);
    if (!dirDelete) {
      const parentDir = directoriesData.find((d) => d.id === parentDirId);
      const remainingFiles = parentDir.files.filter((fileId) => fileId !== id);
      parentDir.files = remainingFiles;
      await writeFile(
        "./db/directoryDB.json",
        JSON.stringify(directoriesData, null, 2)
      );
    }
    await writeFile("./db/fileDB.json", JSON.stringify(filesData, null, 2));
    return { success: true, message: "file deleted" };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

//Delete files
router.delete("/:id", async (req, res) => {

  const parentDirId = req.headers["parentdirid"];
  
  const { type } = req.query;
  const { id } = req.params;

  if (type === "file") {
    const result = await deleteFile(id, parentDirId, false);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ message: "file deleted" });
  } else {
    const dir = directoriesData.find((d) => d.id === id);
    if (!dir) return res.status(404).json({ message: "Directory not found" });

    if (dir.files.length > 0) {
      dir.files.forEach(async (fileId) => {
        await deleteFile(fileId, id, true);
      });
    }
    const index = directoriesData.indexOf(dir);
    directoriesData.splice(index, 1);
    const parentDir = directoriesData.find((d) => d.id === parentDirId);
    const subdirs = parentDir.directories.filter((subdirId) => subdirId !== id);
    parentDir.directories = subdirs;
    try {
      await writeFile(
        "./db/directoryDB.json",
        JSON.stringify(directoriesData, null, 2)
      );
      res.status(200).json({ message: "Directory deleted" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
});

export default router;
