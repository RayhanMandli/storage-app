import express from "express";
import { createWriteStream } from "fs";
import path from "path";
import filesData from "../db/fileDB.json" with { type: "json" };
import directoriesData from "../db/directoryDB.json" with { type: "json" };
import { writeFile } from "fs/promises";

const router = express.Router();

//Upload files
router.post("/:filename", (req, res) => {
  let parentDirID = req.headers["parentdirid"];
  if (parentDirID === "root") parentDirID = req.user.rootDirId;
  let { filename } = req.params;
  const id = crypto.randomUUID();
  const extension = path.extname(filename);
  const fileNameWithID = id + extension;

  const writeStream = createWriteStream(`./storage/${fileNameWithID}`);
  req.pipe(writeStream);

  writeStream.on("finish", async () => {
    const parentDir = directoriesData.find((dir) => dir.id === parentDirID);
    parentDir.files.push(id);

    filesData.push({
      id,
      filename,
      extension,
      pDir: parentDirID,
      createdAt: new Date().toISOString(),
    });
    try {
      await writeFile("./db/fileDB.json", JSON.stringify(filesData, null, 2));
      await writeFile(
        "./db/directoryDB.json",
        JSON.stringify(directoriesData, null, 2)
      );
    } catch (e) {
      return res.status(500).json({ message: "Error saving file metadata" });
    }
    res.status(200).json({ message: "File uploaded successfully" });
  });
});

export default router;
