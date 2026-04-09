import cloudinary from "../services/cloudinary.js";
import path from "path";
import { ObjectId } from "mongodb";
import { File } from "../models/fileModel.js";
import {
    logFileOperation,
    logError,
    logSecurity,
    logInfo,
} from "../utils/logger.js";
import domPurifier from "../utils/dompurifier.js";
import { Directory } from "../models/directoryModel.js";
import mongoose from "mongoose";

const maxLimit = {
    file: 100 * 1024 * 1024, // 100 MB
    profilePicture: 5 * 1024 * 1024, // 5 MB
};

async function parentDirArrayBuilder(dirId, parents) {
    return Directory.findById(dirId).then((dir) => {
        if (dir) {
            parents.push(dir._id);
            if (dir.parentDirId) {
                return parentDirArrayBuilder(dir.parentDirId, parents);
            }
        }
        return Promise.resolve();
    });
}

export const uploadFileController = async (req, res, next) => {
    try {
        req.on("data", () => console.log("📦 receiving data"));
        req.on("end", () => console.log("✅ request ended"));
        let parentDirId = req.headers["parentdirid"];
        const mime = req.headers["x-file-type"];
        const filesize = Number(req.headers["filesize"]);

        if (!Number.isFinite(filesize)) {
            return res.status(400).json({ message: "Invalid filesize header" });
        }

        if (filesize > maxLimit.file) {
            res.status(413).end();
            return req.destroy();
        }

        parentDirId =
            parentDirId === "root"
                ? req.user.rootDirId
                : new ObjectId(parentDirId);

        let { filename } = domPurifier(req.params);
        const extension = path.extname(filename);

        if (
            !filename ||
            filename.includes("..") ||
            filename.includes("/") ||
            filename.includes("\\")
        ) {
            return res.status(400).json({ message: "Invalid filename" });
        }

        // 🔥 detect resource type
        let resourceType = "auto";
        if (mime?.startsWith("video/")) resourceType = "video";
        else if (mime?.startsWith("image/")) resourceType = "image";
        else resourceType = "raw";

        // 🚀 START STREAM IMMEDIATELY
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                public_id: `${new ObjectId().toString()}${extension}`, // temp id (optional)
            },
            async (error, result) => {
                console.log("🔥 Cloudinary callback", { error, result });
                if (error) return next(error);

                try {
                    // 🔥 NOW do DB work (safe)
                    const session = await mongoose.startSession();
                    session.startTransaction();

                    let newFile;

                    try {
                        newFile = await File.create(
                            [
                                {
                                    filename,
                                    filesize,
                                    extension,
                                    parentDirId,
                                    userId: req.user._id,
                                    cloudinaryPublicId: result.public_id,
                                    url: result.secure_url,
                                },
                            ],
                            { session },
                        );

                        const parents = [];
                        await parentDirArrayBuilder(parentDirId, parents);

                        await Directory.updateMany(
                            { _id: { $in: parents } },
                            { $inc: { size: filesize } },
                            { session },
                        );

                        await session.commitTransaction();
                    } catch (err) {
                        await session.abortTransaction();
                        throw err;
                    } finally {
                        session.endSession();
                    }

                    return res.status(200).json({
                        message: "File uploaded successfully",
                    });
                } catch (err) {
                    return next(err);
                }
            },
        );

        // 🔥 PIPE IMMEDIATELY
        req.pipe(uploadStream);
    } catch (err) {
        next(err);
    }
};

export const serveFileController = async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.query;

    // Validate file ID
    if (!ObjectId.isValid(id)) {
        logSecurity("FILE_ACCESS_INVALID_ID", {
            userId: req.user._id,
            fileId: id,
            action,
            ip: req.ip,
        });
        return res.status(400).json({ message: "Invalid file ID" });
    }

    try {
        const file = await File.findById(id);
        const nameWithoutExt = file.filename.replace(/\.[^/.]+$/, "");
        // remove {} or [] or () from filename to prevent issues in content-disposition
        const sanitizedFilename = nameWithoutExt.replace(/[\{\}\[\]\(\)]/g, "");
        const safeName = encodeURIComponent(sanitizedFilename);

        if (!file) {
            logSecurity("FILE_ACCESS_NOT_FOUND", {
                userId: req.user._id,
                fileId: id,
                action,
                ip: req.ip,
            });
            return res.status(404).json({ message: "File not found" });
        }

        let url = file.url;
        // 🔥 FORCE DOWNLOAD
        if (action === "download") {
            url = url.replace(
                "/upload/",
                `/upload/fl_attachment:${safeName}/`,
            );
        }

        // 📊 logging
        logFileOperation(
            action === "download" ? "download" : "view",
            req.user._id,
            id,
            file.filename,
            true,
        );

        // 🚀 REDIRECT TO CLOUDINARY
        return res.redirect(url);
    } catch (error) {
        logError("File serve error", error, {
            userId: req.user._id,
            fileId: id,
            action,
        });

        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error" });
        }
        next(error);
    }
};

export const renameFileController = async (req, res, next) => {
    const { id } = req.params;
    let { newName } = domPurifier(req.body);
    // Validate inputs
    if (!ObjectId.isValid(id)) {
        logSecurity("FILE_RENAME_INVALID_ID", {
            userId: req.user._id,
            fileId: id,
            newName,
            ip: req.ip,
        });
        return res.status(400).json({ message: "Invalid file ID" });
    }

    if (!newName || newName.trim().length === 0) {
        return res.status(400).json({ message: "New filename is required" });
    }

    // Validate new filename to prevent path traversal
    if (
        newName.includes("..") ||
        newName.includes("/") ||
        newName.includes("\\")
    ) {
        logSecurity("FILE_RENAME_INVALID_NAME", {
            userId: req.user._id,
            fileId: id,
            newName,
            ip: req.ip,
        });
        return res.status(400).json({ message: "Invalid filename" });
    }

    try {
        // Find file first to verify ownership and get old name
        const existingFile = await File.findById(id);
        if (!existingFile) {
            logSecurity("FILE_RENAME_NOT_FOUND", {
                userId: req.user._id,
                fileId: id,
                newName,
                ip: req.ip,
            });
            return res.status(404).json({ message: "File not found" });
        }

        // Verify user owns the file
        if (existingFile.userId.toString() !== req.user._id.toString()) {
            logSecurity("FILE_RENAME_UNAUTHORIZED", {
                userId: req.user._id,
                fileId: id,
                fileOwnerId: existingFile.userId,
                newName,
                ip: req.ip,
            });
            return res.status(403).json({ message: "Access denied" });
        }

        const oldName = existingFile.filename;

        // Update filename in database
        const updatedFile = await File.findByIdAndUpdate(
            { _id: id },
            { filename: newName.trim() },
            { new: true },
        );

        if (!updatedFile) {
            return res.status(404).json({ message: "File not found" });
        }

        // Log successful rename
        logFileOperation("rename", req.user._id, id, newName, true);
        logInfo("File renamed successfully", {
            userId: req.user._id,
            fileId: id,
            oldName,
            newName: newName.trim(),
        });

        res.status(200).json({ message: "File renamed successfully" });
    } catch (error) {
        logError("File rename error", error, {
            userId: req.user._id,
            fileId: id,
            newName,
        });

        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};
