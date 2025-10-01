import usersData from "../db/userDB.json" with { type: "json" };

export function authMiddleware(req, res, next) {
  const { userId } = req.cookies;
  const user = usersData.find((u) => u.id === userId);

  if (!userId || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user; // Attach user info to request object
  next();
}
