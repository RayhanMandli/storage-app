import express from "express";
import { rm } from "fs/promises";
import { ObjectId } from "mongodb";

const router = express.Router();

//single level directory deletion
const deleteDirectory = async (db, id, next) => {
  const directoriesCollection = db.collection("directories");
  const filesCollection = db.collection("files");
  const dir = await directoriesCollection.findOne({ _id: new ObjectId(id) });
  if (!dir) return { success: false, message: "Directory not found" };

  try {
    const filesToBeDeleted = await filesCollection
      .find({ parentDirId: dir._id })
      .toArray();
    for (let file of filesToBeDeleted) {
      await rm(`./storage/${file._id.toString()}${file.extension}`, {
        force: true,
      });
    }
    const filesDelete = await filesCollection.deleteMany({ parentDirId: dir._id });
    const deletedDir = await directoriesCollection.deleteOne({ _id: dir._id });
    if (deletedDir.deletedCount === 0)
      return { success: false, message: "Could not delete directory" };
    return { success: true, message: "directory deleted" };
  } catch (e) {
    next(e);
  }
};
const deleteFile = async (db, id) => {
  const filesCollection = db.collection("files");
  const file = await filesCollection.findOne({ _id: new ObjectId(id) });
  const { extension } = file;
  if (!file) return { success: false, message: "File not found" };

  try {
    await rm(`./storage/${id}${extension}`, {
      force: true,
    });
    const deletedFile = await filesCollection.deleteOne({ _id: file._id });
    if (deletedFile.deletedCount === 0)
      return { success: false, message: "Could not delete file" };
    return { success: true, message: "file deleted" };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

//Delete files
router.delete("/:id", async (req, res, next) => {
  const { type } = req.query;
  const { id } = req.params;
  const db = req.db;

  if (type === "file") {
    const result = await deleteFile(db,id);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ message: result.message });
  } else {
    const result = await deleteDirectory(db, id, next);
    try {
      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }
      res.status(200).json({ message: result.message });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
});

export default router;
