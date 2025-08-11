import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
