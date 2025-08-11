import { createClient } from "redis";
import { config } from "./env.js";

export const redisClient = createClient({ url: config.REDIS_URL });
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.connect();
redisClient.on("error", (err) => console.error("Redis Client Error", err));