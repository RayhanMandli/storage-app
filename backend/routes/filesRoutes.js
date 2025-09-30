import express from "express";
import { writeFile } from "fs/promises";
import filesData from "../db/fileDB.json" with { type: "json" };

const router = express.Router();

//Serve files
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const { action } = req.query;

  const file = filesData.find((file) => file.id === id);

  if (!file) return res.status(404).json({ message: "File not found" });

  if (action == "download") {
    res.set("Content-Disposition", "attachment");
  }

  try {
    res.sendFile(`${process.cwd()}/storage/${id}${file.extension}`);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//Rename files
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  let { newName } = req.body;

  try {
    let file = filesData.find((file) => file.id === id);
    if (!file) return res.status(404).json({ message: "File not found" });
    file.filename = newName;

    await writeFile("./db/fileDB.json", JSON.stringify(filesData, null, 2));
    res.status(200).json({ message: "file renamed" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
