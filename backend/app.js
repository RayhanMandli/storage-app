import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authMiddleware } from "./middlewares/auth.js";



const app = express();
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173",
}));
app.use(cookieParser());
app.use(express.json());



app.use("/directory", authMiddleware, directoryRoutes);
app.use("/delete",authMiddleware, deleteRoutes);
app.use("/files",authMiddleware, filesRoutes);
app.use("/upload",authMiddleware, uploadRoutes);
app.use("/user",authMiddleware, userRoutes);
app.use("/auth", authRoutes);


//Starting the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
