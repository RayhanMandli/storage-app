import express from "express";
import {
    isAuthority,
    isHigherAuthority,
    isOwner,
} from "../middlewares/authorization.js";
import {
    getAllUsers,
    getDeletedUsers,
    getUserProfile,
    hardDeleteUserById,
    logoutUserById,
    recoverSoftDeletedUserById,
    softDeleteUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserProfile);

router.get("/all", isAuthority, getAllUsers);
router.get("/deleted", isOwner, getDeletedUsers);

router.post("/logout/:userId", isAuthority, logoutUserById);

// soft delete user
router.patch("/delete/:userId", isHigherAuthority, softDeleteUserById);
router.patch("/recover/:userId", isOwner, recoverSoftDeletedUserById);

// hard delete user
router.delete("/delete/:userId/hard", isHigherAuthority, hardDeleteUserById);
export default router;
