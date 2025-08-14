// routes/test.js
import express from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Simple in-memory rate limiter for demo (swap with RedisStore for production)
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 3, // Allow only 3 requests in 10 sec
  message: { message: "🚫 Too many requests, please try again later" }
});

router.get("/test-rate-limit", limiter, (req, res) => {
  res.json({ message: "✅ API request successful!" });
});

export default router;
