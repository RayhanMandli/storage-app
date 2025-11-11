import { User } from "../models/userModel.js";
import { Directory } from "../models/directoryModel.js";
import bcrypt from "bcrypt";
import Session from "../models/sessionModel.js";

const hashPassword = async (password) => {
    return bcrypt.hash(password, 12);
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newRootDir = await Directory({
            name: `root-${email}`,
        });
        const rootDirId = newRootDir._id;

        const newUser = await User({
            rootDirId,
            name,
            email,
            password: await hashPassword(password),
        });
        await newUser.save();
        newRootDir.userId = newUser._id;
        await newRootDir.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            //duplicate key error
            return res.status(400).json({ error: "Email already exists" });
        }
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    //Restrict to two devices/session
    const sessionCount = await Session.countDocuments({ userId: user._id });
    if (sessionCount >= 2) {
        //delete oldest session
        const oldestSession = await Session.findOne({ userId: user._id }).sort({
            createdAt: 1,
        });
        await Session.deleteOne({ _id: oldestSession._id });
    }

    const session = await Session.create({ userId: user._id });

    res.cookie("sid", session.id, {
        maxAge: 24 * 60 * 60 * 1000,
        signed: true,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    res.json({ message: "Login successful" });
};

export const userLogout = async (req, res) => {
    const sessionId = req.signedCookies.sid;
    await Session.findByIdAndDelete(sessionId);
    res.clearCookie("sid");
    res.json({ message: "Logout successful" });
};

export const userLogoutAll = async (req, res) => {
    const userId = req.user._id;
    await Session.deleteMany({ userId });
    res.clearCookie("sid");
    res.json({ message: "Logged out from all devices successfully" });
}
