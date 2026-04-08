import { User } from "../models/userModel.js";
import redisClient from "./redis.js";
import { deleteSession, getSession } from "../services/sessionService.js";

export async function authMiddleware(req, res, next) {
    const { sid } = req.signedCookies;
    if (!sid) {
        return res.status(401).json({ error: "Unauthorized 1" });
    }
    const session = await getSession(redisClient, sid);
    if (!session) {
        await deleteSession(redisClient, sid);
        return res.status(401).json({ error: "Unauthorized 3" });
    }
    const user = await User.findById(session.userId).lean();
    if (!user) {
        await deleteSession(redisClient, sid);
        return res.status(401).json({ error: "Unauthorized 4" });
    }
    req.user = user;
    next();
}
