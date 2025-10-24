import { createWriteStream } from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { File } from "../models/fileModel.js";

export const uploadFileController = async (req, res, next) => {
  let parentDirId = req.headers["parentdirid"];
  if (parentDirId !== "root") {
    parentDirId = new ObjectId(parentDirId);
  } else {
    parentDirId = req.user.rootDirId;
  }
  let { filename } = req.params;
  // console.log(parentDirId);
  const extension = path.extname(filename);
  try {
    const newFile = await File.insertOne({
      filename,
      extension,
      parentDirId,
      userId: req.user._id,
    });

    const fileNameWithID = newFile._id.toString() + extension;

    const writeStream = createWriteStream(`./storage/${fileNameWithID}`);
    req.pipe(writeStream);

    writeStream.on("finish", async () => {
      res.status(200).json({ message: "File uploaded successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed" });
    next(error);
  }
};

export const serveFileController = async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.query;

  const file = await File.findById(id);

  if (!file) return res.status(404).json({ message: "File not found" });

  if (action == "download") {
    res.set("Content-Disposition", "attachment");
  }

  try {
    res.sendFile(`${process.cwd()}/storage/${id}${file.extension}`);
  } catch (e) {
    res.status(400).json({ message: e.message });
    next(e);
  }
};

export const renameFileController = async (req, res) => {
  const { id } = req.params;

  let { newName } = req.body;

  try {
    let file = await File.findByIdAndUpdate(
      { _id: id },
      { filename: newName },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json({ message: "file renamed" });
  } catch (e) {
    next(e);
  }
};
