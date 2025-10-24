import express from "express";
import { Db, ObjectId } from "mongodb";
import { User } from "../models/userModel.js";
import { Directory } from "../models/directoryModel.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newRootDir = await Directory({
      name: `root-${email}`,
    });
    // console.log(newRootDir);
    const rootDirId = newRootDir._id;

    const newUser = await User({
      rootDirId,
      name,
      email,
      password,
    });
    await newUser.save();
    newRootDir.userId = newUser._id;
    await newRootDir.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const db = req.db;
  // const usersCollection = db.collection("users");
  const user = await User.findOne({ email, password });
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
