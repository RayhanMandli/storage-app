import express from "express";
import { createWriteStream } from "fs";

const router = express.Router();

//Upload files
router.post("/{*path}", (req, res) => {
  let { path } = req.params;

  const filename = req.headers["x-filename"];
  let directoryPath = `./storage/${path ? path.splice(1).join("/") : ""}`;

  const fullPath = `${directoryPath}/${filename}`;
  const writeStream = createWriteStream(fullPath);
  req.pipe(writeStream);

  writeStream.on("finish", () => {
    res.status(200).json({ message: "File uploaded successfully" });
  });
});

export default router;