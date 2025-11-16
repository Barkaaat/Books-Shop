import { createClient } from "redis";
import { env } from "./env.js"

export const redis = createClient({
  url: env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Error:", err));

await redis.connect();
