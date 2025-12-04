import { User } from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { Directory } from "../models/directoryModel.js";

export const getUserProfile = (req, res) => {
    res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        connected: req.user.googleDrive?.refresh_token ? true : false,
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
            .select("_id name")
            .lean();
        for (const user of users) {
            const sessionCount = await Session.countDocuments({
                userId: user._id,
            });
            if (sessionCount > 0) {
                user.isLoggedIn = true;
            } else {
                user.isLoggedIn = false;
            }
        }
        res.status(200).json({ users, role: req.user.role });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const logoutUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        await Session.deleteMany({ userId });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to log out user" });
    }
};
export const softDeleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        await Session.deleteMany({ userId });
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
        await Session.deleteMany({ userId });
        await User.findByIdAndDelete(userId);
        await Directory.deleteMany({ userId });
        await File.deleteMany({ userId });
        res.status(200).json({ message: "User hard deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to hard delete user" });
    }
};
