import { File } from "../models/fileModel.js";
import { User } from "../models/userModel.js";
import domPurifier from "../utils/dompurifier.js";
import { fileAccessSchema } from "../validators/zodValidation.js";

export const shareFileAccess = async (req, res) => {
    const fileId = req.params.fileId;
    const cleanData = domPurifier(req.body);
    const {success, data, error}= fileAccessSchema.safeParse(cleanData);
    if(!success){
        return res.status(400).json({message: "Invalid request data", error});
    }
    const { email, permission } = data;
    try {
        const file = await File.findById(fileId);
        const userToShare = await User.findOne({ email });
        if (!userToShare) {
            return res
                .status(404)
                .json({ message: "User to share with not found" });
        }
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (
            file.sharedWith.some(
                (share) =>
                    share.userId.toString() === userToShare._id.toString()
            )
        ) {
            return res
                .status(400)
                .json({ message: "File already shared with this user" });
        }
        file.sharedWith.push({ userId: userToShare._id, permission });
        await file.save();
        return res.json({ message: "File shared successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteSharedAccess = async (req, res) => {
    const { fileId, userId } = req.params;
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        file.sharedWith = file.sharedWith.filter(
            (share) => share.userId.toString() !== userId
        );
        await file.save();
        return res.json({ message: "Shared access removed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
