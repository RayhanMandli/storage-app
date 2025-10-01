import express from "express";
import {writeFile} from "fs/promises";
import directoriesData from "../db/directoryDB.json" with { type: "json" };
import filesData from "../db/fileDB.json" with { type: "json" };

const router = express.Router();

// //Function to read directory and return files and folders
// export const readDirectory = async (directoryName) => {
//   let directoryPath = `./storage/${directoryName ? directoryName : ""}`;
//   let files = await readdir(directoryPath);
//   let jsonData = [];

//   for (const file of files) {
//     try {
//       const stats = await stat(`${directoryPath}/${file}`);

//       jsonData.push({ name: file, isDir: stats.isDirectory() });
//       jsonData.sort((a, b) => {
//         if (a.isDir && !b.isDir) return -1;
//         if (!a.isDir && b.isDir) return 1;
//         return a.name.localeCompare(b.name);
//       });
//     } catch (e) {
//       res.status(400).json({ message: e.message });
//     }
//   }
//   return jsonData;
// };



router.get("/{:id}", (req,res)=>{
  const userId = req.user.id;
  const userRootDirId = req.user.rootDirId;
  const dirid = req.params.id || userRootDirId;

  const directoryData = directoriesData.find(dir=>dir.id===dirid);

  if(directoryData.userId !== userId) return res.status(403).json({message: "Forbidden"});
  if(!directoryData) return res.status(404).json({message: "Directory not found"});

  const files = directoryData.files.map(fileId =>{
    return filesData.find(file=>file.id===fileId)
  })

  const directories = directoryData.directories.map(dirId=>{
    return directoriesData.find(dir=>dir.id===dirId)
  })

  res.json({...directoryData, files, directories});

})

router.post("/:dirname", async(req,res)=>{
  const userId = req.user.id;
  const userRootDirId = req.user.rootDirId;
  const parentDirId = req.headers.parentdirid || userRootDirId;
  const id = crypto.randomUUID();
  const {dirname} = req.params;

  const parentDir = directoriesData.find(dir=>dir.id===parentDirId);
  if(!parentDir) return res.status(400).json({message: "Parent directory not found"})
  parentDir.directories.push(id);
  directoriesData.push({id, name: dirname, pDir: parentDirId, userId, files: [], directories: []})
  try{
    await writeFile("./db/directoryDB.json", JSON.stringify(directoriesData, null, 2));
    res.status(200).json({message: "Directory created successfully"})
  }catch(e){
    return res.status(500).json({ message: "Error creating directory" });
  }
})

router.patch("/:id", async(req,res)=>{
  const {newName} = req.body;
  const {id} = req.params;
  const dir = directoriesData.find(d=>d.id===id);
  if(!dir) return res.status(404).json({message: "Directory not found"});
  dir.name = newName;
  try{
    await writeFile("./db/directoryDB.json", JSON.stringify(directoriesData, null, 2));
    res.status(200).json({message: "Directory renamed successfully"})
  }catch(e){
    return res.status(500).json({ message: "Error renaming directory" });
  }
})

export default router;