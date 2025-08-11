import express from "express";
import { pool } from "../config/db.js";
import { redisClient } from "../config/redis.js";
import { generateTokens } from "../utils/generateTokens.js";
import { verifyToken } from "../utils/verifyToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { config } from "../config/env.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await hashPassword(password);
  await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashed]);
  res.status(201).json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (!user.rows.length) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user.rows[0].id);
  await redisClient.set(user.rows[0].id.toString(), refreshToken);

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ accessToken });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  const decoded = verifyToken(refreshToken, config.JWT_REFRESH_SECRET);
  if (!decoded) return res.status(403).json({ message: "Invalid refresh token" });

  const storedToken = await redisClient.get(decoded.userId.toString());
  if (storedToken !== refreshToken) return res.status(403).json({ message: "Token mismatch" });

  const { accessToken, refreshToken: newRefresh } = generateTokens(decoded.userId);
  await redisClient.set(decoded.userId.toString(), newRefresh);

  res.cookie("refreshToken", newRefresh, { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ accessToken });
});

export default router;
