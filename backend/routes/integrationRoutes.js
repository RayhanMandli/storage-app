import express from "express";
import {
    fetchGoogleDriveFile,
    fetchGoogleDriveFolderContent,
    googleDriveCallback,
    listRootContents,
} from "../controllers/integrationController.js";
const router = express.Router();

router.get("/google-drive/callback", googleDriveCallback);
router.get("/drive/list-root", listRootContents);
router.get("/drive/list/:id", fetchGoogleDriveFolderContent)
router.get("/drive/file/download/:id", fetchGoogleDriveFile)
export default router;
