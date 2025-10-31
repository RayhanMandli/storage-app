import express from "express";
import { User } from "../models/userModel.js";
import { Directory } from "../models/directoryModel.js";
import crypto from "node:crypto";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newRootDir = await Directory({
      name: `root-${email}`,
    });
    const rootDirId = newRootDir._id;

    const newUser = await User({
      rootDirId,
      name,
      email,
      password,
    });
    await newUser.save();
    newRootDir.token = newUser._id;
    await newRootDir.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      //duplicate key error
      return res.status(400).json({ error: "Email already exists" });
    }
    console.log(error);
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
  const cookieObj = {
    id: user._id,
    expiry: Math.round(Date.now() / 1000 + 10),
  };
  const stringifiedObj = JSON.stringify(cookieObj);

  res.cookie("token", Buffer.from(stringifiedObj).toString("base64url"), {
    maxAge: 24 * 60 * 60 * 1000,
    signed: true,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Login successful" });
});

//Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Logout successful" });
});

export default router;
