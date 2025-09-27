import express from "express";
import cors from "cors";
import { readdir, stat, rename, rm } from "fs/promises";

const app = express();

app.use(express.json());
app.use(cors());

//Function to read directory and return files and folders
const readDirectory = async (directoryName) => {
  let directoryPath = `./storage/${directoryName ? directoryName : ""}`;
  let files = await readdir(directoryPath);
  let jsonData = [];

  for (const file of files) {
    try {
      const stats = await stat(`${directoryPath}/${file}`);

      jsonData.push({ name: file, isDir: stats.isDirectory() });
      jsonData.sort((a, b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  return jsonData;
};

//Serve root directory
app.get("/", async (req, res) => {
  res.json(await readDirectory());
});

//Serve sub directories
app.get("/directory/{*dirname}", async (req, res) => {
  const { dirname } = req.params;

  res.json(await readDirectory(dirname.join("/")));
});

//Serve files
app.get("/files/{*path}", (req, res) => {
  const { path } = req.params;
  const { action } = req.query;

  if (action == "download") {
    res.set("Content-Disposition", "attachment");
  }
  if (
    path[path.length - 1].endsWith(".mp4") ||
    path[path.length - 1].endsWith(".mkv")
  ) {
    res.set("Content-Type", "video/mp4");
  }
  try {
    res.sendFile(`${import.meta.dirname}/storage/${path.splice(1).join("/")}`);
  } catch (e) {}
});

//Rename files
app.patch("/files/{*filename}", async (req, res) => {
  const { filename } = req.params;

  let { newFileName, filePath } = req.body;
  if (filePath.startsWith("directory")) {
    filePath = filePath.replace("directory/", "");
  }
  let absolutePath = `${import.meta.dirname}/storage/${filePath}`;
  try {
    await rename(
      `${absolutePath}/${filename}`,
      `${absolutePath}/${newFileName}`
    );
    res.status(200).json({ message: "file renamed" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//Delete files
app.delete("/files/:filename", async (req, res) => {
  const { filename } = req.params;

  let { filePath } = req.body;
  if (filePath.startsWith("directory")) {
    filePath = filePath.replace("directory/", "");
  }
  // let absolutePath = `${import.meta.dirname}/storage/${filePath}`;
  try {
    await rm(`./storage/${filePath}/${filename}`);
    res.status(200).json({ message: "file deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000")
});
