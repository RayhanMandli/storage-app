import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();
console.log("Redis connected");
export default redisClient;
