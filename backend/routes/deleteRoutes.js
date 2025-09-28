import express from "express";
import { rm } from "fs/promises";

const router = express.Router();

//Delete files
router.delete("/:filename", async (req, res) => {
  const { filename } = req.params;

  let { filePath } = req.body;
  if (filePath.startsWith("directory")) {
    filePath = filePath.replace("directory/", "");
  }
  // let absolutePath = `${import.meta.dirname}/storage/${filePath}`;
  try {
    await rm(`./storage/${filePath}/${filename}`, {
      recursive: true,
      force: true,
    });
    res.status(200).json({ message: "file deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;