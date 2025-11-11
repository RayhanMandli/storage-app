import express from "express";
import {
    userLogin,
    userLogout,
    userLogoutAll,
    userRegister,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/logout", userLogout);

router.post("/all-logout",authMiddleware, userLogoutAll);

export default router;
