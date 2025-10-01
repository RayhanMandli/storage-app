import express from "express";
import {writeFile } from "fs/promises";
import directoriesData from "../db/directoryDB.json" with { type: "json" };
import usersData from "../db/userDB.json" with { type: "json" };

const router = express.Router();


// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = usersData.find((user) => user.email === email);
  const id = crypto.randomUUID();
  const rootDirId = crypto.randomUUID();

  if (userExists) {
    return res.status(409).json({ error: "Email already exists" });
  }
  const newUser = {
    id,
    rootDirId,
    name,
    email,
    password, // In production, hash the password before storing
  };

  const newRootDirectory = {
    id: rootDirId,
    name: `root-${email}`,
    parentId: null,
    userId: id,
    files: [],
    directories: [],
  };
  
  usersData.push(newUser);
  directoriesData.push(newRootDirectory);
  try {
    await writeFile(
      "./db/userDB.json",
      JSON.stringify(usersData, null, 2)
    );
    await writeFile(
      "./db/directoryDB.json",
      JSON.stringify(directoriesData, null, 2)
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = usersData.find(
    (user) => user.email === email && user.password === password
  );
  // console.log(user)
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.cookie("userId", user.id, { maxAge: 24 * 60 * 60 * 1000 , httpOnly: true, sameSite: 'none', secure: true});
  res.json({ message: "Login successful" });
})

export default router;
