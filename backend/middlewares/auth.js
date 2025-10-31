import { ObjectId } from "mongodb";
import { User } from "../models/userModel.js";

export async function authMiddleware(req, res, next) {
  const { token } = req.signedCookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const decodedToken = Buffer.from(token, "base64url").toString("utf-8");
  const { id: idPart } = JSON.parse(decodedToken);

  const user = await User.findById(idPart);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;
  next();
}
