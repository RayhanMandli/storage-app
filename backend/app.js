import express from "express";
import cors from "cors";
import {mkdir } from "fs/promises";
import { readDirectory } from "./routes/directoryRoutes.js";
import directoryRoutes from "./routes/directoryRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


const app = express();

app.use(express.json());
app.use(cors());


app.use("/directory", directoryRoutes);
app.use("/delete", deleteRoutes);
app.use("/files", filesRoutes);
app.use("/upload", uploadRoutes);

//Creating Directory
app.post("/create-folder", async (req, res) => {
  let { foldername, dirPath } = req.body;
  if (dirPath.startsWith("directory")) {
    dirPath = dirPath.replace("directory/", "");
  }
  let directoryPath = `./storage/${dirPath ? dirPath : ""}/${foldername}`;
  try {
    await mkdir(directoryPath);
    res.status(200).json({ message: "Directory created" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//Serve root directory
app.get("/", async (req, res) => {
  res.json(await readDirectory());
});

//Starting the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
