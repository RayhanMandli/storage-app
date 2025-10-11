import express from "express";
import { writeFile } from "fs/promises";
import { Db } from "mongodb";
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // const userExists = usersData.find((user) => user.email === email);
  // const id = crypto.randomUUID();
  // const rootDirId = crypto.randomUUID();

  const db = req.db;
  const directoriesCollection = db.collection("directories");
  const usersCollection = db.collection("users");

  try {
    const userExists = await usersCollection.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newDir = await directoriesCollection.insertOne({
      name: `root-${email}`,
      parentDirId: null
    });
    const rootDirId = newDir.insertedId;

    const newUser = await usersCollection.insertOne({
      rootDirId,
      name,
      email,
      password,
    });
    const userId = newUser.insertedId;

    directoriesCollection.updateOne({ _id: rootDirId }, { $set: { userId } });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Login Route
router.post("/login", async(req, res) => {
  const { email, password } = req.body;
  const db = req.db;
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ email, password });
  // console.log(user)
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  // console.log(user)
  res.cookie("userId", user._id.toString(), {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Login successful" });
});

//Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("userId", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Logout successful" });
});

export default router;
