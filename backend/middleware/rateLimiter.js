// backend/middleware/rateLimiter.js
import { redisClient } from "../utils/redisClient.js";

const WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

export default async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `rate:${ip}`;
    const ttl = WINDOW_MINUTES * 60;

    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, ttl);
    }

    if (current > MAX_REQUESTS) {
      res.set('Retry-After', ttl.toString());
      return res.status(429).json({ error: 'Too many requests. Try later.' });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error', err);
    next();
  }
}
