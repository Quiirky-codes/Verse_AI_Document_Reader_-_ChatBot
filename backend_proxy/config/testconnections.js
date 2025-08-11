import { pool } from "./db.js";
import redis from "redis";
import { config } from "./env.js";

async function testPostgres() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected. Server time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
  }
}

async function testRedis() {
  const client = redis.createClient({ url: config.REDIS_URL });
  client.on("error", (err) => console.error("❌ Redis connection failed:", err));
  client.on("connect", () => console.log("✅ Redis connected"));
  await client.connect();
  await client.quit();
}

(async () => {
  await testPostgres();
  await testRedis();
  process.exit();
})();
