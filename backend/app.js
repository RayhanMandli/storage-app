import "./middlewares/db.js";
import "./middlewares/redis.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import { authMiddleware } from "./middlewares/auth.js";
import "dotenv/config";

const secret = process.env.COOKIE_SECRET;
const app = express();
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use(cookieParser(secret));
app.use(express.json());
app.use("/directory", authMiddleware, directoryRoutes);
app.use("/delete", authMiddleware, deleteRoutes);
app.use("/files", authMiddleware, filesRoutes);
app.use("/upload", authMiddleware, uploadRoutes);
app.use("/user", authMiddleware, userRoutes);
app.use("/admin", authMiddleware, adminRoutes);
app.use("/share", authMiddleware, shareRoutes);
app.use("/auth", authRoutes);
app.use("/integrations", authMiddleware, integrationRoutes);

//Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

//Starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
