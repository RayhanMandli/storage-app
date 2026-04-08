import { Readable } from "stream";

import { User } from "../models/userModel.js";
import {
    exchangeCodeForTokens,
    getValidAccessToken,
} from "../services/googleDriveService.js";

export const googleDriveCallback = async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");

    try {
        const tokens = await exchangeCodeForTokens(code);

        console.log("🔐 Google Drive tokens:", tokens);

        if (!tokens.refresh_token) {
            // Google sometimes doesn't return refresh_token unless prompt=consent
            return res.status(400).send("No refresh token received");
        }

        // Save tokens to user's profile in DB
        await User.updateOne(
            { _id: req.user._id },
            {
                googleDrive: {
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expires_at: Date.now() + tokens.expires_in * 1000,
                    scope: tokens.scope,
                },
            }
        );
        res.redirect(process.env.CLIENT_URL);
    } catch (err) {
        console.error("Error in Google Drive callback:", err);
        return res.status(500).send("Internal Server Error");
    }
};
export const listRootContents = async (req, res) => {
    const token = await getValidAccessToken(req.user);
    const resp = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
            new URLSearchParams({
                q: "'root' in parents and trashed=false",
                fields: "files(id,name,mimeType,parents,size,modifiedTime)",
            }),
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await resp.json();
    console.log("gdrive data: ",data)
    const files = data.files
        .filter((f) => f.mimeType !== "application/vnd.google-apps.folder")
        .map((f) => ({ _id: f.id, name: f.name, pDir: null, source: "drive" }));
    const directories = data.files
        .filter((f) => f.mimeType === "application/vnd.google-apps.folder")
        .map((f) => ({ _id: f.id, name: f.name, pDir: null, source: "drive" }));

    return res.json({ files, directories });
};
export const fetchGoogleDriveFolderContent = async (req, res) => {
    const folderId = req.params.id;
    const token = await getValidAccessToken(req.user);

    const query = `'${folderId}' in parents`;

    const resp = await fetch(
        "https://www.googleapis.com/drive/v3/files?" +
            new URLSearchParams({
                q: query,
                fields: "files(id,name,mimeType,parents,size,modifiedTime)",
            }),
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await resp.json();
    const files = data.files
        .filter((f) => f.mimeType !== "application/vnd.google-apps.folder")
        .map((f) => ({ _id: f.id, name: f.name, pDir: null, source: "drive" }));
    const directories = data.files
        .filter((f) => f.mimeType === "application/vnd.google-apps.folder")
        .map((f) => ({ _id: f.id, name: f.name, pDir: null, source: "drive" }));

    return res.json({ files, directories });
};
export const fetchGoogleDriveFile = async (req, res) => {
    const fileId = req.params.id;
    try {
        const token = await getValidAccessToken(req.user);

        const driveStream = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        res.setHeader(
            "Content-Type",
            driveStream.headers.get("content-type") ||
                "application/octet-stream"
        );
        if (req.query.action === "download") {
            res.setHeader("Content-Disposition", `attachment`);
        }
        const nodeStream = Readable.fromWeb(driveStream.body);
        nodeStream.pipe(res);
    } catch (err) {
        console.error("Error fetching Google Drive file:", err);
        return res
            .status(500)
            .json({ error: "Failed to fetch file from Google Drive" });
    }
};
