import express from "express";
import { createWriteStream } from "fs";
import path from "path";
import { Db, ObjectId } from "mongodb";
import { File } from "../models/fileModel.js";

const router = express.Router();

//Upload files
router.post("/:filename", async (req, res, next) => {
  let parentDirId = req.headers["parentdirid"];
  if (parentDirId !== "root") {
    parentDirId = new ObjectId(parentDirId);
  } else {
    parentDirId = req.user.rootDirId;
  }
  let { filename } = req.params;
  console.log(parentDirId);
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
});

export default router;
