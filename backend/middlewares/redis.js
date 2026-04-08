import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-18637.c91.us-east-1-3.ec2.cloud.redislabs.com',
        port: 18637
    }
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();
console.log("Redis connected");
redisClient.get("test").then((value) => {
  console.log("Redis test value:", value);
}).catch((err) => {
  console.error("Error getting test value from Redis:", err);
});
export default redisClient;
