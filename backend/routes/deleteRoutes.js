import express from "express";
import { deleteController } from "../controllers/deleteController.js";
import { requireDataPermission } from "../middlewares/accessPermission.js";

const router = express.Router();

//Delete files and directories
router.delete("/:id", deleteController);

export default router;
