import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    connected: req.user.googleDrive?.refresh_token ? true : false,
  })
})


export default router;
