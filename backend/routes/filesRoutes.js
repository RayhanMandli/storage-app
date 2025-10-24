import express from "express";
import { File } from "../models/fileModel.js";

const router = express.Router();

router
  .route("/:id")
  .get(async (req, res, next) => {
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
  })
  .patch(async (req, res) => {
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
  });

export default router;
