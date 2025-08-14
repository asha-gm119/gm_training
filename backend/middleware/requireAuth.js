// middleware/requireAuth.js
import jwt from "jsonwebtoken";
import { tokenExists } from "../utils/redisClient.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export default async function requireAuth(req, res, next) {
  try {
    // first try session
    if (req.session?.userId) {
      const u = await User.findById(req.session.userId).select("-password");
      if (!u) return res.status(401).json({ error: "Unauthorized" });
      req.user = u;
      return next();
    }

    // token auth
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

    const token = auth.slice(7);
    // verify signature
    const payload = jwt.verify(token, JWT_SECRET);

    // confirm token exists in Redis (not revoked)
    const ok = await tokenExists(token);
    if (!ok) return res.status(401).json({ error: "Token revoked" });

    // attach user payload (and optionally fetch user document)
    req.user = { id: payload.id, username: payload.username };
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
