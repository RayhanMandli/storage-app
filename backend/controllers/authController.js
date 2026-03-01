import { User } from "../models/userModel.js";
import { Directory } from "../models/directoryModel.js";
import Session from "../models/sessionModel.js";
import { logAuth, logError, logSecurity } from "../utils/logger.js";
import { Otp } from "../models/otpModel.js";
import { otpHandler } from "../services/sendOtpService.js";
import { verifyIdTokenAndLoginWithGoogle } from "../services/googleAuthService.js";
import {
    getAccessTokenFromCode,
    getGithubUserData,
    getGithubUserEmail,
} from "../services/githubAuthService.js";
import mongoose from "mongoose";
import redisClient from "../middlewares/redis.js";
import {
    loginSchema,
    registerSchema,
    sendOtpSchema,
    verifyOtpSchema,
} from "../validators/zodValidation.js";
import domPurifier from "../utils/dompurifier.js";

export const userRegister = async (req, res) => {
    const cleanData = domPurifier(req.body);
    const { success, data, error } = registerSchema.safeParse(cleanData);
    if (!success) {
        return res.status(400).json({ error: "Invalid request data", error });
    }
    const { name, email, password } = data;
    const session = await mongoose.startSession();

    // Log registration attempt
    logAuth("register_attempt", null, email);

    try {
        session.startTransaction();
        // Create root directory for the new user
        const newRootDir = await Directory(
            {
                name: `root-${email}`,
            },
            { session }
        );
        const rootDirId = newRootDir._id;
        newRootDir.path.push(newRootDir._id);
        // Create new user with hashed password
        const newUser = await User(
            {
                rootDirId,
                name,
                email,
                password,
            },
            { session }
        );
        await newUser.save();

        // Link root directory to user
        newRootDir.userId = newUser._id;
        await newRootDir.save();
        await session.commitTransaction();
        await session.endSession();
        // Log successful registration
        logAuth("register", newUser._id, email, true);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error - email already exists
            logAuth("register", null, email, false, error);
            return res.status(400).json({ error: "Email already exists" });
        }
        await session.abortTransaction();
        await session.endSession();
        // Log unexpected error during registration
        logError("User registration failed", error, { email, name });
        res.status(500).json({ error: "Internal server error" });
    }
};

export const userLogin = async (req, res) => {
    const cleanData = domPurifier(req.body);
    const { success, data, error } = loginSchema.safeParse(cleanData);
    if (!success) {
        return res.status(400).json({ error: "Invalid request data", error });
    }
    const { email, password } = data;

    // Log login attempt
    logAuth("login_attempt", null, email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        // Log failed login due to non-existent user
        logSecurity("LOGIN_FAILED_USER_NOT_FOUND", { email, ip: req.ip });
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        // Log failed login due to invalid password
        logSecurity("LOGIN_FAILED_INVALID_PASSWORD", {
            email,
            userId: user._id,
            ip: req.ip,
        });
        return res.status(401).json({ error: "Invalid email or password" });
    }

    try {
        // Session management: Restrict to two devices/sessions
        const { total: sessionCount } = await redisClient.ft.search(
            "userIdx",
            `@user:{${user._id.toString()}}`,
            {
                LIMIT: {
                    from: 0,
                    size: 0,
                },
            }
        );
        if (sessionCount >= 2) {
            // Delete oldest session to maintain limit
            const sessions = await redisClient.ft.search(
                "userIdx",
                `@user:{${user._id.toString()}}`,
                {
                    SORTBY: {
                        BY: "createdAt",
                        DIRECTION: "ASC",
                    },
                    LIMIT: {
                        from: 0,
                        size: 1,
                    },
                }
            );
            const oldestSessionId = sessions.documents[0].id.split(":")[1];
            await redisClient.del(`session:${oldestSessionId}`);

            logAuth("session_cleanup", user._id, email, true, null);
        }

        // session using redis
        const sessionId = crypto.randomUUID();
        await redisClient.json.set(`session:${sessionId}`, "$", {
            userId: user._id.toString(),
            createdAt: Date.now(),
        });
        await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
        // Set secure cookie with session ID
        res.cookie("sid", sessionId, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        // Log successful login
        logAuth("login", user._id, email, true);

        res.json({ message: "Login successful" });
    } catch (error) {
        // Log session creation error
        logError("Session creation failed during login", error, {
            userId: user._id,
            email,
        });
        res.status(500).json({ error: "Internal server error" });
    }
};

export const userLogout = async (req, res) => {
    const sessionId = req.signedCookies.sid;

    try {
        // Find session before deletion for logging
        // const session = await Session.findById(sessionId);

        if (sessionId) {
            const session = await redisClient.del(sessionId);
            // Log successful logout
            logAuth("logout", session.userId, null, true);
        } else {
            // Log attempt to logout with invalid session
            logSecurity("LOGOUT_INVALID_SESSION", { sessionId, ip: req.ip });
        }

        res.clearCookie("sid");
        res.json({ message: "Logout successful" });
    } catch (error) {
        // Log logout error
        logError("Logout failed", error, { sessionId });
        res.status(500).json({ error: "Internal server error" });
    }
};

export const userLogoutAll = async (req, res) => {
    const userId = req.user._id;

    try {
        // Count sessions before deletion for logging
        const sessionCount = await Session.countDocuments({ userId });

        // Delete all sessions for the user
        const result = await Session.deleteMany({ userId });

        // Log logout from all devices
        logAuth("logout_all", userId, null, true);
        logInfo("User logged out from all devices", {
            userId,
            sessionsDeleted: result.deletedCount,
            previousSessionCount: sessionCount,
        });

        res.clearCookie("sid");
        res.json({ message: "Logged out from all devices successfully" });
    } catch (error) {
        // Log logout all error
        logError("Logout all failed", error, { userId });
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendOtp = async (req, res) => {
    const cleanData = domPurifier(req.body);
    const { success, data, error } = sendOtpSchema.safeParse(cleanData);
    if (!success) {
        return res.status(400).json({ error: "Invalid request data", error });
    }
    const { email } = data;
    const result = await otpHandler(email);
    if (result.success) {
        res.json({ message: "OTP sent successfully" });
    } else {
        res.status(500).json({ error: result.message });
    }
};

export const verifyOtp = async (req, res) => {
    const cleanData = domPurifier(req.body);
    const { success, data, error } = verifyOtpSchema.safeParse(cleanData);
    if (!success) {
        return res.status(400).json({ error: "Invalid request data", error });
    }
    const { email, otp } = data;
    try {
        const record = await Otp.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        await Otp.deleteOne({ email });
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const handleGoogleLogin = async (req, res) => {
    const idToken = req.body.credential;
    const userData = await verifyIdTokenAndLoginWithGoogle(idToken);
    if (!userData) {
        return res.status(401).json({ error: "Invalid ID token" });
    }

    const { email, name, sub: googleId, email_verified } = userData;
    if (!email_verified) {
        return res.status(400).json({ error: "Email not verified" });
    }

    const user = await User.findOne({ email });
    if (user && user.isDeleted) {
        return res.status(403).json({
            error: "Account is deleted. Contact owner of this app to recover your account.",
        });
    }
    if (!user) {
        // Create root directory for the new user
        const newRootDir = await Directory({
            name: `root-${email}`,
        });
        const rootDirId = newRootDir._id;

        // Create new user with hashed password
        const newUser = await User({
            rootDirId,
            name,
            googleId,
            email,
        });
        await newUser.save();

        // Link root directory to user
        newRootDir.userId = newUser._id;
        await newRootDir.save();

        // Log successful registration
        logAuth("login with google", newUser._id, email, true);

        // Create new session
        const sessionId = crypto.randomUUID();
        await redisClient.json.set(`session:${sessionId}`, "$", {
            userId: newUser._id.toString(),
            createdAt: Date.now(),
        });
        await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
        // Set secure cookie with session ID
        res.cookie("sid", sessionId, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return res.status(201).json({ message: "User logged in with google" });
    }
    if (user.googleId) {
        if (user.googleId !== googleId) {
            return res.status(400).json({ error: "Google ID mismatch" });
        } else {
            // Session management: Restrict to two devices/sessions
            const { total: sessionCount } = await redisClient.ft.search(
                "userIdx",
                `@user:{${user._id.toString()}}`,
                {
                    LIMIT: {
                        from: 0,
                        size: 0,
                    },
                }
            );
            if (sessionCount >= 2) {
                // Delete oldest session to maintain limit
                const sessions = await redisClient.ft.search(
                    "userIdx",
                    `@user:{${user._id.toString()}}`,
                    {
                        SORTBY: {
                            BY: "createdAt",
                            DIRECTION: "ASC",
                        },
                        LIMIT: {
                            from: 0,
                            size: 1,
                        },
                    }
                );
                const oldestSessionId = sessions.documents[0].id.split(":")[1];
                await redisClient.del(`session:${oldestSessionId}`);

                logAuth("session_cleanup", user._id, email, true, null);
            }

            // Create new session
            // const session = await Session.create({ userId: user._id });
            // session using redis
            const sessionId = crypto.randomUUID();
            await redisClient.json.set(`session:${sessionId}`, "$", {
                userId: user._id.toString(),
                createdAt: Date.now(),
            });
            await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
            // Set secure cookie with session ID
            res.cookie("sid", sessionId, {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                signed: true,
                httpOnly: true,
                sameSite: "lax",
                secure: true,
            });

            res.status(201).json({ message: "User logged in with google" });
        }
    } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save();

        // Session management: Restrict to two devices/sessions
        const { total: sessionCount } = await redisClient.ft.search(
            "userIdx",
            `@user:{${user._id.toString()}}`,
            {
                LIMIT: {
                    from: 0,
                    size: 0,
                },
            }
        );
        if (sessionCount >= 2) {
            // Delete oldest session to maintain limit
            const sessions = await redisClient.ft.search(
                "userIdx",
                `@user:{${user._id.toString()}}`,
                {
                    SORTBY: {
                        BY: "createdAt",
                        DIRECTION: "ASC",
                    },
                    LIMIT: {
                        from: 0,
                        size: 1,
                    },
                }
            );
            const oldestSessionId = sessions.documents[0].id.split(":")[1];
            await redisClient.del(`session:${oldestSessionId}`);

            logAuth("session_cleanup", user._id, email, true, null);
        }

        // Create new session
        // const session = await Session.create({ userId: user._id });
        // session using redis
        const sessionId = crypto.randomUUID();
        await redisClient.json.set(`session:${sessionId}`, "$", {
            userId: user._id.toString(),
            createdAt: Date.now(),
        });
        await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
        // Set secure cookie with session ID
        res.cookie("sid", sessionId, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });
        return res.status(201).json({ message: "User logged in with google" });
    }
};
export const handleGithubLogin = async (req, res) => {
    const { code } = req.query;
    const accessToken = await getAccessTokenFromCode(code);
    const ghUser = await getGithubUserData(accessToken);
    const emailRes = await getGithubUserEmail(accessToken);
    const email = emailRes.find((e) => e.primary)?.email;

    if (!email) {
        return res.status(403).json({
            error: "No primary GitHub email found. Make sure user:email scope is enabled.",
        });
    }

    if (!ghUser) {
        return res.status(401).json({ error: "Invalid GitHub code" });
    }

    //extract needed data
    const { id: githubId, name } = ghUser;

    const user = await User.findOne({ email });
    if (!user) {
        // Create root directory for the new user
        const newRootDir = await Directory({
            name: `root-${email}`,
        });
        const rootDirId = newRootDir._id;

        // Create new user with hashed password
        const newUser = await User({
            rootDirId,
            name,
            githubId,
            email,
        });
        await newUser.save();

        // Link root directory to user
        newRootDir.userId = newUser._id;
        await newRootDir.save();

        // Log successful registration
        logAuth("login with github", newUser._id, email, true);

        // Create new session

        // session using redis
        const sessionId = crypto.randomUUID();
        await redisClient.json.set(`session:${sessionId}`, "$", {
            userId: newUser._id.toString(),
            createdAt: Date.now(),
        });
        await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
        // Set secure cookie with session ID
        res.cookie("sid", sessionId, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return res.redirect("http://localhost:5173");
    }
    if (user.githubId) {
        if (user.githubId !== "" + githubId) {
            return res.status(400).json({ error: "GitHub ID mismatch" });
        } else {
            // Session management: Restrict to two devices/sessions
            const { total: sessionCount } = await redisClient.ft.search(
                "userIdx",
                `@user:{${user._id.toString()}}`,
                {
                    LIMIT: {
                        from: 0,
                        size: 0,
                    },
                }
            );
            if (sessionCount >= 2) {
                // Delete oldest session to maintain limit
                const sessions = await redisClient.ft.search(
                    "userIdx",
                    `@user:{${user._id.toString()}}`,
                    {
                        SORTBY: {
                            BY: "createdAt",
                            DIRECTION: "ASC",
                        },
                        LIMIT: {
                            from: 0,
                            size: 1,
                        },
                    }
                );
                const oldestSessionId = sessions.documents[0].id.split(":")[1];
                await redisClient.del(`session:${oldestSessionId}`);

                logAuth("session_cleanup", user._id, email, true, null);
            }

            // Create new session
            // const session = await Session.create({ userId: user._id });
            // session using redis
            const sessionId = crypto.randomUUID();
            await redisClient.json.set(`session:${sessionId}`, "$", {
                userId: user._id.toString(),
                createdAt: Date.now(),
            });
            await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
            // Set secure cookie with session ID
            res.cookie("sid", sessionId, {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                signed: true,
                httpOnly: true,
                sameSite: "lax",
                secure: true,
            });

            return res.redirect("http://localhost:5173");
        }
    } else if (!user.githubId) {
        user.githubId = githubId;
        await user.save();

        // Session management: Restrict to two devices/sessions
        const { total: sessionCount } = await redisClient.ft.search(
            "userIdx",
            `@user:{${user._id.toString()}}`,
            {
                LIMIT: {
                    from: 0,
                    size: 0,
                },
            }
        );
        if (sessionCount >= 2) {
            // Delete oldest session to maintain limit
            const sessions = await redisClient.ft.search(
                "userIdx",
                `@user:{${user._id.toString()}}`,
                {
                    SORTBY: {
                        BY: "createdAt",
                        DIRECTION: "ASC",
                    },
                    LIMIT: {
                        from: 0,
                        size: 1,
                    },
                }
            );
            const oldestSessionId = sessions.documents[0].id.split(":")[1];
            await redisClient.del(`session:${oldestSessionId}`);

            logAuth("session_cleanup", user._id, email, true, null);
        }

        // Create new session
        // const session = await Session.create({ userId: user._id });
        // session using redis
        const sessionId = crypto.randomUUID();
        await redisClient.json.set(`session:${sessionId}`, "$", {
            userId: user._id.toString(),
            createdAt: Date.now(),
        });
        await redisClient.expire(`session:${sessionId}`, 24 * 60 * 60); // 24 hours
        // Set secure cookie with session ID
        res.cookie("sid", sessionId, {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return res.redirect("http://localhost:5173");
    }
};
