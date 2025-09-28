import express from "express";
import {rename} from "fs/promises";

const router = express.Router();

//Serve files
router.get("/{*path}", (req, res) => {
  const { path } = req.params;
  const { action } = req.query;

  if (action == "download") {
    res.set("Content-Disposition", "attachment");
  }
  if (
    path[path.length - 1].endsWith(".mp4") ||
    path[path.length - 1].endsWith(".mkv")
  ) {
    res.set("Content-Type", "video/mp4");
  }
  try {
    res.sendFile(`${import.meta.dirname}/storage/${path.splice(1).join("/")}`);
  } catch (e) {}
});

//Rename files
router.patch("/{*filename}", async (req, res) => {
  const { filename } = req.params;

  let { newFileName, filePath } = req.body;
  if (filePath.startsWith("directory")) {
    filePath = filePath.replace("directory/", "");
  }
  let absolutePath = `${import.meta.dirname}/storage/${filePath}`;
  try {
    await rename(
      `${absolutePath}/${filename}`,
      `${absolutePath}/${newFileName}`
    );
    res.status(200).json({ message: "file renamed" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;