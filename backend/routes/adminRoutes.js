import express from "express";
import { adminFileAccess } from "../controllers/adminController.js";
import { isHigherAuthority } from "../middlewares/authorization.js";

const router = express.Router();

//get files
router.get("/users/:userId/files", isHigherAuthority,adminFileAccess);

//get folders
router.get("/users/:userId/folders", (req, res) => {
    res.send(`Get all folders for user ${req.params.userId}`);
});
export default router;
