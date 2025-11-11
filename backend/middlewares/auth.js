import { User } from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { Types } from "mongoose";

const createSession = async () => {
    const session = new Session();
    await session.save();
    return session;
};

export async function authMiddleware(req, res, next) {
    const { sid } = req.signedCookies;
    if (!sid) {
        res.clearCookie("sid", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!Types.ObjectId.isValid(sid)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const session = await Session.findById(sid).lean();
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session;

    const user = await User.findById(session.userId).lean();
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
}
