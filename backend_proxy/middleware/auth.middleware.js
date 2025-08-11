import { verifyToken } from "../utils/verifyToken.js";
import { config } from "../config/env.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, config.JWT_ACCESS_SECRET);
  if (!decoded) return res.status(403).json({ message: "Invalid token" });

  req.user = decoded;
  next();
};
