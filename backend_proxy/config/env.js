import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5001,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_default_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_default_refresh_secret",
  DB_URL: process.env.DB_URL || "your_postgres_url",
  REDIS_URL: process.env.REDIS_URL || "your_redis_url",
};
