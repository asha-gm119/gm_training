import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { publisher, storeToken, revokeToken } from "../utils/redisClient.js";
import { broadcastAlert } from "../routes/alerts.js"; // <-- added SSE broadcaster

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_TTL = process.env.JWT_TTL_SECONDS
  ? Number(process.env.JWT_TTL_SECONDS)
  : 3600; // 1 hour

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_TTL }
    );

    await storeToken(token, user._id, JWT_TTL);
    req.session.userId = user._id;

    // 🔥 broadcast SSE + Redis pub/sub
    const alert = {
      type: "user_created",
      message: `New user ${user.username} registered`,
      timestamp: Date.now(),
    };
    broadcastAlert(alert);
    await publisher.publish("alerts", JSON.stringify(alert));

    res.status(201).json({
      message: "registered",
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_TTL }
    );

    await storeToken(token, user._id, JWT_TTL);
    req.session.userId = user._id;

    // 🔥 broadcast SSE + Redis pub/sub
    const alert = {
      type: "login",
      message: `User ${user.username} logged in`,
      timestamp: Date.now(),
    };
    broadcastAlert(alert);
    await publisher.publish("alerts", JSON.stringify(alert));

    res.json({
      message: "logged in",
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (token) {
      await revokeToken(token);

      const decoded = jwt.decode(token);
      if (decoded?.username) {
        // 🔥 broadcast SSE + Redis pub/sub
        const alert = {
          type: "logout",
          message: `User ${decoded.username} logged out`,
          timestamp: Date.now(),
        };
        broadcastAlert(alert);
        await publisher.publish("alerts", JSON.stringify(alert));
      }
    }

    req.session?.destroy?.(() => {});
    res.clearCookie("connect.sid");

    res.json({ message: "logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// /me endpoint
router.get("/me", async (req, res) => {
  try {
    if (req.session?.userId) {
      const u = await User.findById(req.session.userId).select("-password");
      return res.json({ user: u });
    }

    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, JWT_SECRET);
    const u = await User.findById(payload.id).select("-password");
    if (!u) return res.status(401).json({ error: "Not authenticated" });

    res.json({ user: u });
  } catch (err) {
    console.error("me error:", err);
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
