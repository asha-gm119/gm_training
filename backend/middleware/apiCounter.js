
import { redisClient } from "../utils/redisClient.js";

export default async function apiCounter(req, res, next) {
  try {
    await redisClient.incr("api:count");
    next();
  } catch (err) {
    console.error("API counter error:", err);
    next();
  }
}
