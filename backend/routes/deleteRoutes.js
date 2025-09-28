console.log("Delete route module loaded");

import express from "express";
import { rm, writeFile } from "fs/promises";
import filesData from "../db/fileDB.json" with { type: "json" };

const router = express.Router();

//Delete files
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const file = filesData.find(f => f.id === id);
  console.log(file)
  console.log(filesData)
  const { extension } = file;
  console.log("{id, extension}: ", { id, extension });

  try {
    await rm(`./storage/${id}${extension}`, {
      force: true,
    });

    filesData.splice(filesData.indexOf(file), 1);

    await writeFile("./db/fileDB.json", JSON.stringify(filesData, null, 2));

    res.status(200).json({ message: "file deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
