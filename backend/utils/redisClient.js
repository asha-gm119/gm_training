// utils/redisClient.js
import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

export const publisher = createClient({ url });
export const subscriber = createClient({ url });

// used for key/value ops (same as publisher for demo; production might separate)
export const redisClient = createClient({ url });

publisher.on("error", (err) => console.error("Redis Publisher Error", err));
subscriber.on("error", (err) => console.error("Redis Subscriber Error", err));
redisClient.on("error", (err) => console.error("Redis Client Error", err));

await Promise.all([publisher.connect(), subscriber.connect(), redisClient.connect()]);

// helper functions for token storage
export async function storeToken(token, userId, ttlSeconds) {
  // key: token:<token> -> value userId, expire after ttl
  await redisClient.setEx(`token:${token}`, ttlSeconds, String(userId));
}

export async function revokeToken(token) {
  await redisClient.del(`token:${token}`);
}

export async function tokenExists(token) {
  const v = await redisClient.get(`token:${token}`);
  return v !== null;
}

export default redisClient;
