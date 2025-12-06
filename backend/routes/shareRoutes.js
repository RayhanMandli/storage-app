import express from "express";
import { deleteSharedAccess, shareFileAccess } from "../controllers/shareController.js";

const router = express.Router();

router.post("/:fileId", shareFileAccess);
router.delete("/:fileId/:userId", deleteSharedAccess);

export default router;
