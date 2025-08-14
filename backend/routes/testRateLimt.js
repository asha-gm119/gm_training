// routes/testRateLimit.js
import express from "express";
import requestLogger from "../middleware/requestLogger.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/test-rate-limit", rateLimiter, requestLogger, (req, res) => {
  res.json({ message: "✅ API request successful!" });
});

export default router;
