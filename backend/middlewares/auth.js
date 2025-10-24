import { ObjectId } from "mongodb";
import { User } from "../models/userModel.js";

export async function authMiddleware(req, res, next) {
  const { userId } = req.cookies;
  // const db = req.db;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;
  next();
}
