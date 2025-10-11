import { ObjectId } from "mongodb";

export async function authMiddleware(req, res, next) {
  const { userId } = req.cookies;
  // console.log(userId)
  const db = req.db;
  if(!userId){
    return res.status(401).json({ error: "Unauthorized" });
  }
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user; 
  next();
}
