import express from "express";
import { uploadFileController } from "../controllers/fileController.js";

const router = express.Router();

//Upload files
router.post("/:filename", uploadFileController);

export default router;
