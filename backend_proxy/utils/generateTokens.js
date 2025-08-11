import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, config.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, config.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};