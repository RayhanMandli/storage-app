import express from "express";
import { renameFileController, serveFileController } from "../controllers/fileController.js";
import { requireDataPermission } from "../middlewares/fileAccess.js";

const router = express.Router();

router
  .route("/:id")
  .get(requireDataPermission("canView"), serveFileController)
  .patch(renameFileController);

export default router;
