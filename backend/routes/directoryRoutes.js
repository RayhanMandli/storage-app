import { dir } from "console";
import express from "express";
import { Db, ObjectId } from "mongodb";
// import {writeFile} from "fs/promises";
// import directoriesData from "../db/directoryDB.json" with { type: "json" };
// import filesData from "../db/fileDB.json" with { type: "json" };

const router = express.Router();

router.get("/{:id}", async (req, res) => {
  const userId = req.user._id;
  const userRootDirId = req.user.rootDirId;
  const dirid = req.params.id ? new ObjectId(req.params.id) : userRootDirId;
  const db = req.db;
  const directoriesCollection = db.collection("directories");
  const directoryData = await directoriesCollection.findOne({
    _id: dirid,
    userId,
  });

  if (!directoryData)
    return res.status(404).json({ message: "Directory not found" });

  //* Files serves are going to be handled here
  const files = [];
  // const files = directoryData.files.map(fileId =>{
  //   return filesData.find(file=>file.id===fileId)
  // })

  const directories = await directoriesCollection
    .find({ parentDirId: dirid })
    .toArray();

  res.json({
    ...directoryData,
    files,
    directories
  });
});

router.post("/:dirname", async (req, res) => {
  const userId = req.user._id;
  const userRootDirId = req.user.rootDirId;
  let parentDirId = req.headers.parentdirid;

  if (parentDirId !== "root") parentDirId = new ObjectId(parentDirId);
  else parentDirId = userRootDirId;

  const db = req.db;
  const directoriesCollection = db.collection("directories");
  console.log({parentDirId});
  const { dirname } = req.params;

  try {
    const parentDir = await directoriesCollection.findOne({
      _id: parentDirId,
    });
    console.log({parentDir})
    if (!parentDir)
      return res.status(400).json({ message: "Parent directory not found" });

    const newDir = await directoriesCollection.insertOne({
      name: dirname,
      parentDirId,
      userId,
    });
    res.status(200).json({ message: "Directory created successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Error creating directory" });
  }
});

router.patch("/:id", async (req, res) => {
  const { _id: userId } = req.user;
  const { newName } = req.body || "New Folder";
  const { id } = req.params;
  const db = req.db;
  const directoriesCollection = db.collection("directories");

  try {
    const dir = await directoriesCollection.findOne({
      _id: new ObjectId(id),
      userId,
    });

    if (!dir)
      return res
        .status(404)
        .json({ message: "Directory not found or Forbidden" });

    const updatedDir = await directoriesCollection.updateOne(
      { _id: dir._id },
      { $set: { name: newName } }
    );

    res.status(200).json({ message: "Directory renamed successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Error renaming directory" });
  }
});

export default router;
