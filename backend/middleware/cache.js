import { redisClient } from "../utils/redisClient.js";

export default async function cacheMiddleware(req, res, next) {
  try {
    const cacheData = await redisClient.get("employees:all");
    if (cacheData) {
      return res.json({ fromCache: true, data: JSON.parse(cacheData) });
    }
    next();
  } catch (err) {
    next(err);
  }
}
