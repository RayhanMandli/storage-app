import "./middlewares/db.js";
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

const secret = "my-secret-key"
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser(secret));
app.use(express.json());

// app.use(async (req, res, next) => {
//   const client = await connectDB();
//   const db = client.db("storageApp");
//   req.db = db;
//   next();
// });
app.use("/directory", authMiddleware, directoryRoutes);
app.use("/delete", authMiddleware, deleteRoutes);
app.use("/files", authMiddleware, filesRoutes);
app.use("/upload", authMiddleware, uploadRoutes);
app.use("/user", authMiddleware, userRoutes);
app.use("/auth", authRoutes);

//Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

//Starting the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
