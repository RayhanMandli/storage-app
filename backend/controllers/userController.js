import { User } from "../models/userModel.js";
import { Directory } from "../models/directoryModel.js";
import { File } from "../models/fileModel.js";
import { canChangeRole } from "../utils/rbac.js";
import redisClient from "../middlewares/redis.js";
import {
    deleteAllSessionsForUser,
    getSessionCount,
} from "../services/sessionService.js";

export const getUserProfile = async (req, res) => {
   const rootDir =  await Directory.findById(req.user.rootDirId);
    res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        connected: req.user.googleDrive?.refresh_token ? true : false,
        hasPassword: !!req.user.password,
        currentUsage: rootDir.size || 0,
        limit: req.user.maxLimit,
        role: req.user.role,
    });
};
export const getDeletedUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: true })
            .select("_id name")
            .lean();
        res.status(200).json({ users, role: req.user.role });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false })
            .select("_id name role")
            .lean();
        for (const user of users) {
            const sessionCount = await getSessionCount(
                redisClient,
                user._id.toString(),
            );
            if (sessionCount > 0) {
                user.isLoggedIn = true;
            } else {
                user.isLoggedIn = false;
            }
        }
        const currentUser = {
            role: req.user.role,
            id: req.user._id,
            name: req.user.name,
        };
        res.status(200).json({
            users,
            currentUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const setUserPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    if (!password || password.length < 8) {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters long" });
    }
    if (user.password) {
        return res.status(400).json({ message: "Password is already set" });
    }
    try {
        user.password = password;
        await user.save();
        return res.status(200).json({ message: "Password set successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to set password" });
    }
};

export const logoutUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        await deleteAllSessionsForUser(redisClient, userId);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to log out user" });
    }
};
export const softDeleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        await deleteAllSessionsForUser(redisClient, userId);
        const user = await User.findByIdAndUpdate(userId, { isDeleted: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User soft deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to soft delete user" });
    }
};
export const recoverSoftDeletedUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(userId, { isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User recovered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to recover user" });
    }
};
export const hardDeleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        await deleteAllSessionsForUser(redisClient, userId);
        await User.findByIdAndDelete(userId);
        await Directory.deleteMany({ userId });
        await File.deleteMany({ userId });
        res.status(200).json({ message: "User hard deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to hard delete user" });
    }
};
export const changeUserRoleById = async (req, res) => {
    const { userId } = req.params;
    const { newRole } = req.body;
    const userToBeChanged = await User.findById(userId);
    const targetRole = userToBeChanged.role;

    if (userId === req.user._id.toString()) {
        return res
            .status(403)
            .json({ error: "Forbidden: Cannot change your own role" });
    }

    if (!userToBeChanged) {
        return res.status(404).json({ message: "User not found" });
    }

    const { allowed, message } = canChangeRole(
        req.user.role,
        targetRole,
        newRole
    );
    if (!allowed) {
        return res.status(403).json({ error: message });
    }
    try {
        userToBeChanged.role = newRole;
        await userToBeChanged.save();
        return res
            .status(200)
            .json({ message: "User role updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update user role" });
    }
};
