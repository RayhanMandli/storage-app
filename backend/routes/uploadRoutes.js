import express from "express";
import { createWriteStream } from "fs";
import path from "path";
import filesData from "../db/fileDB.json" with { type: "json" };
import { writeFile } from "fs/promises";

const router = express.Router();

//Upload files
router.post("/:filename", (req, res) => {
  let { filename } = req.params;
  const id = crypto.randomUUID();
  console.log('id: ', id);
  const extension = path.extname(filename);
  console.log('extension: ', extension);
  const fileNameWithID = id + extension;
  console.log('fileNameWithID: ', fileNameWithID);

  const writeStream = createWriteStream(`./storage/${fileNameWithID}`);
  req.pipe(writeStream);

  writeStream.on("finish", async() => {
    filesData.push({ id, filename, extension, pDir:0, createdAt: new Date().toISOString() });
    try{
        await writeFile("./db/fileDB.json", JSON.stringify(filesData, null, 2));
    }catch(e){
        return res.status(500).json({ message: "Error saving file metadata" });
    }
    res.status(200).json({ message: "File uploaded successfully" });
  });
});

export default router;