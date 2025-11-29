import express from "express";
import {
    handleGoogleLogin,
    sendOtp,
    userLogin,
    userLogout,
    userLogoutAll,
    userRegister,
    verifyOtp,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyIdTokenAndLoginWithGoogle } from "../services/googleAuthService.js";

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/google", handleGoogleLogin)

router.post("/logout", userLogout);

router.post("/all-logout", authMiddleware, userLogoutAll);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
export default router;
