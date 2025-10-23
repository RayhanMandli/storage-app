import express from "express";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

//Serve files
router
  .route("/:id")
  .get(async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.query;
    const db = req.db;
    const filesCollection = db.collection("files");

    const file = await filesCollection.findOne({ _id: new ObjectId(id) });

    if (!file) return res.status(404).json({ message: "File not found" });

    if (action == "download") {
      res.set("Content-Disposition", "attachment");
    }

    try {
      res.sendFile(`${process.cwd()}/storage/${id}${file.extension}`);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    const db = req.db;
    const filesCollection = db.collection("files");

    let { newName } = req.body;

    try {
      let file = await filesCollection.findOne({ _id: new ObjectId(id) });
      if (!file) return res.status(404).json({ message: "File not found" });
      const updatedFile = await filesCollection.updateOne(
        { _id: file._id },
        { $set: { filename: newName } }
      );
      if (updatedFile.modifiedCount === 0)
        return res.status(500).json({ message: "Could not update file" });
      res.status(200).json({ message: "file renamed" });
    } catch (e) {
      next(e);
    }
  });

export default router;
