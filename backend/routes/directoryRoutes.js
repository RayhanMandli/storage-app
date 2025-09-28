import express from "express";
import { readdir, stat} from "fs/promises";

const router = express.Router();

//Function to read directory and return files and folders
export const readDirectory = async (directoryName) => {
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

//Serve sub directories
router.get("/{*dirname}", async (req, res) => {
  const { dirname } = req.params;

  res.json(await readDirectory(dirname.join("/")));
});

export default router;