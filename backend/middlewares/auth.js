import { User } from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { Types } from "mongoose";

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
    if (!Types.ObjectId.isValid(sid)) {
        return res.status(401).json({ error: "Unauthorized 2" });
    }
    const session = await Session.findById(sid).lean();
    if (!session) {
        return res.status(401).json({ error: "Unauthorized 3" });
    }
    req.session = session;

    const user = await User.findById(session.userId).lean();
    if (!user) {
        return res.status(401).json({ error: "Unauthorized 4" });
    }
    req.user = user;
    next();
}
