import { File } from "../models/fileModel.js";
import { logError, logInfo } from "../utils/logger.js";
import {
    extractFileTextFromUrl,
    isAiExtractionSupported,
} from "./textExtractionService.js";
import { generateSummaryAndTags } from "./geminiService.js";

export async function processFileAiMetadata(fileId) {
    try {
        const file = await File.findById(fileId).lean();
        if (!file) return;

        logInfo("AI metadata processing started", {
            fileId: String(fileId),
            filename: file.filename,
            extension: file.extension,
        });

        if (!isAiExtractionSupported(file.extension)) {
            await File.findByIdAndUpdate(fileId, {
                aiStatus: "skipped",
                summary: null,
                tags: [],
            });

            logInfo("AI metadata skipped for unsupported extension", {
                fileId: String(fileId),
                extension: file.extension,
            });
            return;
        }

        const extraction = await extractFileTextFromUrl({
            url: file.url,
            extension: file.extension,
        });

        if (extraction.status !== "ok" || !extraction.text) {
            await File.findByIdAndUpdate(fileId, {
                aiStatus: "failed",
                summary: null,
                tags: [],
            });

            logError("AI metadata extraction produced no usable text", null, {
                fileId: String(fileId),
                extractionStatus: extraction.status,
            });
            return;
        }

        const aiResult = await generateSummaryAndTags(extraction.text);

        await File.findByIdAndUpdate(fileId, {
            aiStatus: "completed",
            summary: aiResult.summary,
            tags: aiResult.tags,
        });

        logInfo("AI metadata generated", {
            fileId: String(fileId),
            tagCount: aiResult.tags.length,
        });
    } catch (error) {
        await File.findByIdAndUpdate(fileId, {
            aiStatus: "failed",
            summary: null,
            tags: [],
        });

        logError("AI metadata generation failed", error, {
            fileId: String(fileId),
        });
    }
}
