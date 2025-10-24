import express from "express";
import { deleteController } from "../controllers/deleteController.js";

const router = express.Router();



//Delete files and directories
router.delete("/:id", deleteController);

export default router;
