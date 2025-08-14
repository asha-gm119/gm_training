import jwt from "jsonwebtoken";
import { redisClient } from "../utils/redisClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authMiddleware = async (req, res, next) => {
  // Skip auth for public routes
  if (
    req.path === "/auth/login" ||
    req.path === "/auth/register"
  ) {
    return next();
  }

  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);

    // Check if token exists in Redis
    const stored = await redisClient.get(`token:${token}`);
    if (!stored) {
      return res.status(401).json({ error: "Session expired" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired" });
  }
};
