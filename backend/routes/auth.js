// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { publisher } from "../utils/redisClient.js";
import { storeToken, revokeToken } from "../utils/redisClient.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_TTL = process.env.JWT_TTL_SECONDS ? Number(process.env.JWT_TTL_SECONDS) : 3600; // 1 hour

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    // create JWT
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_TTL });

    // store token in redis for revocation + validation
    await storeToken(token, user._id, JWT_TTL);

    // publish alert (optional)
    await publisher.publish("alerts", JSON.stringify({
      type: "user_created",
      message: `New user ${user.username} registered`
    }));

    // optional: keep session for session-based flows too
    req.session.userId = user._id;

    res.status(201).json({ message: "registered", user: { id: user._id, username: user.username }, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    // create JWT
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_TTL });

    // store token in redis
    await storeToken(token, user._id, JWT_TTL);

    // set session too (if you want sessions)
    req.session.userId = user._id;

    // publish login alert
    await publisher.publish("alerts", JSON.stringify({
      type: "login",
      message: `User ${user.username} logged in`
    }));

    res.json({ message: "logged in", user: { id: user._id, username: user.username }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout - revoke current token
router.post("/logout", async (req, res) => {
  try {
    // token may be in Authorization header
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (token) {
      await revokeToken(token);
    }

    // destroy session as before
    req.session?.destroy?.(() => {});
    res.clearCookie("connect.sid");

    res.json({ message: "logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: /me can still use session-based check, or we expose a token-based one
router.get("/me", async (req, res) => {
  try {
    // Try session first
    if (req.session?.userId) {
      const u = await User.findById(req.session.userId).select("-password");
      return res.json({ user: u });
    }

    // Try token
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    const u = await User.findById(payload.id).select("-password");
    if (!u) return res.status(401).json({ error: "Not authenticated" });

    res.json({ user: u });
  } catch (err) {
    console.error("me error:", err);
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
