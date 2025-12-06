import express from "express";
import {
    getDirectoryController,
    createDirectoryController,
    updateDirectoryController,
} from "../controllers/directoryController.js";
const router = express.Router();

router.get("/{:id}", getDirectoryController);

router.post("/:dirname", createDirectoryController);

router.patch("/:id", updateDirectoryController);

export default router;
