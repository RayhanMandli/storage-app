import { Directory } from "../models/directoryModel.js";
import { File } from "../models/fileModel.js";
import { ObjectId } from "mongodb";
import { canAccessUserData } from "../utils/rbac.js";
import { User } from "../models/userModel.js";

export const getDirectoryController = async (req, res) => {
    const requesterId = req.user._id;
    const targetUserId = req.query.userId;
    if (targetUserId) {
        const isSelf = requesterId.toString() === targetUserId.toString();
        if (!isSelf) {
            if (!canAccessUserData(req.user.role, "canView")) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: Insufficient permissions." });
            }
        }
    }
    const targetUser = targetUserId
        ? await User.findById(targetUserId)
        : req.user;
    if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const dirid = req.params.id
        ? new ObjectId(req.params.id)
        : targetUser.rootDirId;
    const directoryData = await Directory.findById(dirid);

    if (!directoryData)
        return res.status(404).json({ message: "Directory not found" });

    const files = await File.find({ parentDirId: dirid }).populate(
        "sharedWith.userId"
    ).lean();

    const filesWithSelfShared = files.map((f) => {
        return { ...f, sharedBy: "self" };
    });
    const otherUserFiles = await File.find({
        "sharedWith.userId": requesterId,
    }).lean();
    const otherUserFilesWithSharedBy = otherUserFiles.map((f) => {
        return { ...f, sharedBy: f.userId, sharedWith: null};
    });
    filesWithSelfShared.push(...otherUserFilesWithSharedBy);
    const directories = await Directory.find({ parentDirId: dirid }).lean();

    res.json({
        ...directoryData,
        files: filesWithSelfShared,
        directories,
    });
};

export const createDirectoryController = async (req, res) => {
    const userId = req.user._id;
    const userRootDirId = req.user.rootDirId;
    // console.log(userRootDirId);
    let parentDirId = req.headers.parentdirid;

    if (parentDirId !== "root") parentDirId = new ObjectId(parentDirId);
    else parentDirId = userRootDirId;
    // console.log(parentDirId);
    const { dirname } = req.params;

    try {
        const parentDir = await Directory.findById(parentDirId);
        // console.log(parentDir);
        if (!parentDir)
            return res
                .status(400)
                .json({ message: "Parent directory not found" });

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
