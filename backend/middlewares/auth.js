import { User } from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { Types } from "mongoose";
import redisClient from "./redis.js";

export async function authMiddleware(req, res, next) {
    const { sid } = req.signedCookies;
    if (!sid) {
        res.clearCookie("sid", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(401).json({ error: "Unauthorized 1" });
    }
    const session = await redisClient.json.get(`session:${sid}`);
    if (!session) {
        return res.status(401).json({ error: "Unauthorized 3" });
    }
    const user = await User.findById(session.userId).lean();
    if (!user) {
        return res.status(401).json({ error: "Unauthorized 4" });
    }
    req.user = user;
    next();
}
