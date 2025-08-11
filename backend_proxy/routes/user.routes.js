import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "User profile data", userId: req.user.userId });
});

export default router;
