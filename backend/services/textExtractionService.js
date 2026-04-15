import { PDFParse } from "pdf-parse";

const MAX_EXTRACTED_CHARS = 3000;

const SUPPORTED_TEXT_EXTENSIONS = new Set([
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".log",
    ".xml",
]);

export function isAiExtractionSupported(extension = "") {
    const normalized = String(extension || "").toLowerCase();
    return normalized === ".pdf" || SUPPORTED_TEXT_EXTENSIONS.has(normalized);
}

function normalizeExtractedText(text = "") {
    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function truncateText(text = "") {
    return text.length > MAX_EXTRACTED_CHARS
        ? text.slice(0, MAX_EXTRACTED_CHARS)
        : text;
}

async function fetchFileBuffer(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file for extraction: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
}

export async function extractFileTextFromUrl({ url, extension }) {
    const normalizedExt = String(extension || "").toLowerCase();

    if (!url || !isAiExtractionSupported(normalizedExt)) {
        return { status: "skipped", text: "" };
    }

    const fileBuffer = await fetchFileBuffer(url);

    if (!fileBuffer.length) {
        return { status: "empty", text: "" };
    }

    let extractedText = "";

    if (normalizedExt === ".pdf") {
        const parser = new PDFParse({ data: fileBuffer });
        try {
            const parsed = await parser.getText();
            extractedText = parsed?.text || "";
        } finally {
            await parser.destroy();
        }
    } else {
        extractedText = fileBuffer.toString("utf8");
    }

    const normalizedText = normalizeExtractedText(extractedText);
    if (!normalizedText) {
        return { status: "empty", text: "" };
    }

    return { status: "ok", text: truncateText(normalizedText) };
}

export { MAX_EXTRACTED_CHARS };
