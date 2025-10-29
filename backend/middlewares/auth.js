import { ObjectId } from "mongodb";
import { User } from "../models/userModel.js";

export async function authMiddleware(req, res, next) {
  const { userId } = req.cookies;
  // const db = req.db;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id: idPart, expiry: expiryInSeconds } = JSON.parse(
    Buffer.from(userId, "base64url").toString()
  );
  const currentInSeconds = Math.floor(Date.now() / 1000);
  if (currentInSeconds > expiryInSeconds) {
    return res.status(401).json({ error: "Session expired" });
  }
  const user = await User.findById(idPart);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;
  next();
}
