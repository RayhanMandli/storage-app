import { Directory } from "../models/directoryModel.js";
import { File } from "../models/fileModel.js";
import cloudinary from "../services/cloudinary.js";

//recursive directory deletion
const deleteDirectory = async (dir) => {
    async function recursiveDelete(directoryId) {
        // 1. delete subdirectories
        const subdirs = await Directory.find({ parentDirId: directoryId });

        for (const subdir of subdirs) {
            await recursiveDelete(subdir._id);
        }

        // 2. delete files in this directory
        const files = await File.find({ parentDirId: directoryId });

        for (const file of files) {
            try {
                let resourseType = null;
                //type by extesion
                if (
                    [".png", ".jpg", ".jpeg", ".webp"].includes(file.extension)
                ) {
                    resourseType = "image";
                } else if (
                    [".mp4", ".avi", ".mov", ".mkv"].includes(file.extension)
                ) {
                    resourseType = "video";
                } else {
                    resourseType = "raw";
                }

                if (file.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
                        resource_type: resourseType,
                    });
                }

                await File.deleteOne({ _id: file._id });
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

        // 3. delete directory itself
        await Directory.deleteOne({ _id: directoryId });
    }

    try {
        await recursiveDelete(id);
        return { success: true, message: "Directory deleted successfully" };
    } catch (e) {
        return { success: false, message: e.message };
    }
};

const deleteFile = async (file) => {
    try {
        // 🔥 delete from cloudinary
        let resourseType = null;
        //type by extesion
        if ([".png", ".jpg", ".jpeg", ".webp"].includes(file.extension)) {
            resourseType = "image";
        } else if ([".mp4", ".avi", ".mov", ".mkv"].includes(file.extension)) {
            resourseType = "video";
        } else {
            resourseType = "raw";
        }

        if (file.cloudinaryPublicId) {
            const result = await cloudinary.uploader.destroy(
                file.cloudinaryPublicId,
                { resource_type: resourseType },
            );

            if (result.result !== "ok" && result.result !== "not found") {
                return { success: false, message: "Cloud delete failed" };
            }
        }

        //deducting the size from every parent directory
        

        // 🔥 delete from DB
        await File.deleteOne({ _id: file._id });

        


        return { success: true, message: "File deleted" };
    } catch (e) {
        return { success: false, message: e.message };
    }
};

export const deleteController = async (req, res, next) => {
    const { type } = req.query;
    const { id } = req.params;

    try {
        let result;

        if (type === "file") {
            const file = await File.findById(id);
            if (!file) {
                return res.status(404).json({ message: "File not found" });
            }
            if (file.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
            result = await deleteFile(file);
        } else {
            const dir = await Directory.findById(id);
            if (!dir) {
                return res.status(404).json({ message: "Directory not found" });
            }
            if (dir.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
            result = await deleteDirectory(dir);
        }

        if (!result.success) {
            return res.status(500).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (e) {
        next(e);
    }
};
