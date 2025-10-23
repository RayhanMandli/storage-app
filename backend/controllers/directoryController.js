import { Directory } from "../models/directoryModel.js";
import { File } from "../models/fileModel.js";
import { ObjectId } from "mongodb";

export const getDirectoryController = async (req, res) => {
  const userId = req.user._id;
  const userRootDirId = req.user.rootDirId;
  const dirid = req.params.id ? new ObjectId(req.params.id) : userRootDirId;
  const directoryData = await Directory.findById(dirid);

  if (!directoryData)
    return res.status(404).json({ message: "Directory not found" });
  if (directoryData.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const files = await File.find({ parentDirId: dirid }).lean();
  const directories = await Directory.find({ parentDirId: dirid }).lean();

  res.json({
    ...directoryData,
    files,
    directories,
  });
};

export const createDirectoryController = async (req, res) => {
  const userId = req.user._id;
  const userRootDirId = req.user.rootDirId;
  console.log(userRootDirId);
  let parentDirId = req.headers.parentdirid;

  if (parentDirId !== "root") parentDirId = new ObjectId(parentDirId);
  else parentDirId = userRootDirId;
  console.log(parentDirId);
  const { dirname } = req.params;

  try {
    const parentDir = await Directory.findById(parentDirId);
    console.log(parentDir);
    if (!parentDir)
      return res.status(400).json({ message: "Parent directory not found" });

    const newDir = await Directory({
      name: dirname,
      parentDirId,
      userId,
    });

    await newDir.save();
    res.status(200).json({ message: "Directory created successfully" });
  } catch (e) {
    console.log(e.errInfo.details);
    console.log(
      JSON.stringify(e.errInfo.details.schemaRulesNotSatisfied, null, 2)
    );

    return res.status(500).json({ message: "Error creating directory" });
  }
};

export const updateDirectoryController = async (req, res) => {
  const { _id: userId } = req.user;
  const { newName } = req.body || "New Folder";
  const { id } = req.params;

  try {
    const dir = await Directory.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { name: newName }
    );

    if (!dir)
      return res
        .status(404)
        .json({ message: "Directory not found or Forbidden" });

    res.status(200).json({ message: "Directory renamed successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Error renaming directory" });
  }
};
