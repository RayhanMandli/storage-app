import { createWriteStream } from "fs";
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
import { rm } from "fs/promises";
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
        let parentDirId = req.headers["parentdirid"];
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

        const session = await mongoose.startSession();

        session.startTransaction();
        let newFile;

        // Upload file and update directory sizes atomically
        try {
            newFile = await File.insertOne(
                {
                    filename,
                    filesize,
                    extension,
                    parentDirId,
                    userId: req.user._id,
                },
                { session }
            );
            const parents = [];
            await parentDirArrayBuilder(parentDirId, parents);
            await Directory.updateMany(
                { _id: { $in: parents } },
                { $inc: { size: filesize } },
                { session }
            );
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }finally{
            session.endSession();
        }

        const fileNameWithID = `${newFile._id}${extension}`;
        const filePath = path.join(process.cwd(), "storage", fileNameWithID);
        const writeStream = createWriteStream(filePath);

        let receivedBytes = 0;
        let aborted = false;

        req.on("data", (chunk) => {
            if (aborted) return;

            receivedBytes += chunk.length;

            if (receivedBytes > maxLimit.file) {
                aborted = true;
                res.status(413).json({
                    message: `File size exceeds ${maxLimit.file} bytes`,
                });

                writeStream.destroy();
                File.deleteOne({ _id: newFile._id }).catch(() => {});
                rm(filePath).catch(() => {});
                return req.destroy();
            }

            if (!writeStream.write(chunk)) {
                req.pause();
                writeStream.once("drain", () => req.resume());
            }
        });

        req.on("end", () => writeStream.end());

        req.on("error", () => {
            writeStream.destroy();
        });

        writeStream.on("error", async () => {
            await File.deleteOne({ _id: newFile._id }).catch(() => {});
            res.status(500).json({ message: "File upload failed" });
        });

        writeStream.on("finish", () => {
            res.status(200).json({ message: "File uploaded successfully" });
        });
    } catch (err) {
        next(err);
    }
};

export const serveFileController = async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.query;

    // Validate file ID format
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
        // Find file in database
        const file = await File.findById(id);

        if (!file) {
            logSecurity("FILE_ACCESS_NOT_FOUND", {
                userId: req.user._id,
                fileId: id,
                action,
                ip: req.ip,
            });
            return res.status(404).json({ message: "File not found" });
        }

        // Set appropriate headers for download
        if (action === "download") {
            res.set(
                "Content-Disposition",
                `attachment; filename="${file.filename}"`
            );
        }

        // Construct safe file path
        const filePath = `${process.cwd()}/storage/${id}${file.extension}`;

        // Log file access
        logFileOperation(
            action === "download" ? "download" : "view",
            req.user._id,
            id,
            file.filename,
            true
        );

        // Send file to client
        res.sendFile(filePath, (error) => {
            if (error) {
                logError("File send error", error, {
                    userId: req.user._id,
                    fileId: id,
                    filename: file.filename,
                    filePath,
                });

                if (!res.headersSent) {
                    res.status(500).json({ message: "Error serving file" });
                }
            }
        });
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
            { new: true }
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
