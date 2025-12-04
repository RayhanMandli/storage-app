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

export const uploadFileController = async (req, res, next) => {
    let parentDirId = req.headers["parentdirid"];
    if (parentDirId !== "root") {
        parentDirId = new ObjectId(parentDirId);
    } else {
        parentDirId = req.user.rootDirId;
    }
    let { filename } = req.params;
    const extension = path.extname(filename);

    // Log file upload attempt
    logInfo("File upload initiated", {
        userId: req.user._id,
        filename,
        extension,
        parentDirId,
        ip: req.ip,
    });

    try {
        // Validate filename to prevent path traversal
        if (
            !filename ||
            filename.includes("..") ||
            filename.includes("/") ||
            filename.includes("\\")
        ) {
            logSecurity("FILE_UPLOAD_INVALID_FILENAME", {
                userId: req.user._id,
                filename,
                ip: req.ip,
            });
            return res.status(400).json({ message: "Invalid filename" });
        }

        // Create file record in database
        const newFile = await File.insertOne({
            filename,
            extension,
            parentDirId,
            userId: req.user._id,
        });

        const fileNameWithID = newFile._id.toString() + extension;
        const filePath = `./storage/${fileNameWithID}`;

        // Create write stream for file storage
        const writeStream = createWriteStream(filePath);

        // Handle stream errors
        writeStream.on("error", (error) => {
            logError("File write stream error", error, {
                userId: req.user._id,
                filename,
                fileId: newFile._id,
            });

            // Clean up database record if file write fails
            File.deleteOne({ _id: newFile._id }).catch((err) => {
                logError(
                    "Failed to cleanup file record after write error",
                    err
                );
            });

            res.status(500).json({ message: "File upload failed" });
        });

        // Pipe request stream to file
        req.pipe(writeStream);

        // Handle successful file write
        writeStream.on("finish", async () => {
            // Log successful file upload
            logFileOperation(
                "upload",
                req.user._id,
                newFile._id,
                filename,
                true
            );

            logInfo("File upload completed", {
                userId: req.user._id,
                fileId: newFile._id,
                filename,
                size: req.headers["content-length"] || "unknown",
            });

            res.status(200).json({ message: "File uploaded successfully" });
        });
    } catch (error) {
        // Log database insertion error
        logError("File upload database error", error, {
            userId: req.user._id,
            filename,
            extension,
            parentDirId,
        });

        res.status(500).json({ message: "File upload failed" });
        next(error);
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

        // Verify user owns the file
        if (file.userId.toString() !== req.user._id.toString()) {
            logSecurity("FILE_ACCESS_UNAUTHORIZED", {
                userId: req.user._id,
                fileId: id,
                fileOwnerId: file.userId,
                action,
                ip: req.ip,
            });
            return res.status(403).json({ message: "Access denied" });
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
    let { newName } = req.body;

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
