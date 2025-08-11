import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
