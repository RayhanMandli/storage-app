import express from "express";
import {
    isAuthority,
    isHigherAuthority,
    isOwner,
} from "../middlewares/authorization.js";
import {
    changeUserRoleById,
    getAllUsers,
    getDeletedUsers,
    getUserProfile,
    hardDeleteUserById,
    logoutUserById,
    recoverSoftDeletedUserById,
    setUserPassword,
    softDeleteUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserProfile);
router.post("/set-password", setUserPassword);
router.get("/all", isAuthority, getAllUsers);
router.get("/deleted", isOwner, getDeletedUsers);

router.post("/logout/:userId", isAuthority, logoutUserById);

router.patch("/delete/:userId", isHigherAuthority, softDeleteUserById);
router.patch("/recover/:userId", isOwner, recoverSoftDeletedUserById);

router.patch("/change-role/:userId", isAuthority, changeUserRoleById);

router.delete("/delete/:userId/hard", isHigherAuthority, hardDeleteUserById);

export default router;
