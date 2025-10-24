import express from "express";
import { renameFileController, serveFileController } from "../controllers/fileController.js";

const router = express.Router();

router
  .route("/:id")
  .get(serveFileController)
  .patch(renameFileController);

export default router;
