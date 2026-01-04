import { rm } from "fs/promises";
import { Directory } from "../models/directoryModel.js";
import { File } from "../models/fileModel.js";

//recursive directory deletion
const deleteDirectory = async (id, next) => {
  const dir = await Directory.findById(id);

  if (!dir) return { success: false, message: "Directory not found" };

  try {
    async function recursiveDelete(directoryId) {
      try {
        // 1. Delete all subdirectories recursively
        const subdirs = await Directory.find({
          parentDirId: directoryId,
        });
        for (const subdir of subdirs) {
          await recursiveDelete(subdir._id);
        }

        // 2. Delete all files in this directory
        const files = await File.find({ parentDirId: directoryId });
        for (const file of files) {
          try {
            await rm(`./storage/${file._id}${file.extension}`, {
              force: true,
            });
            await File.deleteOne({ _id: file._id });
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        }

        // 3. Delete this directory
        await Directory.deleteOne({ _id: directoryId });
      } catch (err) {
        console.error("Error deleting directory:", err);
        throw err;
      }
    }

    // Usage
    await recursiveDelete(id);
    return { success: true, message: "Directory deleted successfully" };
  } catch (e) {
    next(e);
  }
};

const deleteFile = async (id, next) => {
  const file = await File.findById(id);
  const { extension } = file;
  if (!file) return { success: false, message: "File not found" };

  try {
    await rm(`./storage/${id}${extension}`, {
      force: true,
    });
    await File.deleteOne({ _id: file._id });
    return { success: true, message: "file deleted" };
  } catch (e) {
    return { success: false, message: e.message };
    next(e);
  }
};

export const deleteController = async (req, res, next) => {
  const { type } = req.query;
  const { id } = req.params;
  // console.log(id);

  if (type === "file") {
    const result = await deleteFile(id, next);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ message: result.message });
  } else {
    const result = await deleteDirectory(id, next);
    try {
      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }
      res.status(200).json({ message: result.message });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
};
