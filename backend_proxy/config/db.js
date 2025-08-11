import pkg from "pg";
import { config } from "./env.js";

const { Pool } = pkg;
export const pool = new Pool({
  connectionString: config.DB_URL
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});
pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});