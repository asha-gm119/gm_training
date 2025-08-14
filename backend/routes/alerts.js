import express from "express";
import { subscriber } from "../utils/redisClient.js";

const router = express.Router();

// Keep track of active SSE clients
const clients = [];

/**
 * SSE stream endpoint
 */
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL );
  res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  res.flushHeaders();

  // Register this client
  clients.push(res);

  // Send initial "connected" event
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  // Keep-alive heartbeat
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
  }, 20000);

  // Cleanup when client disconnects
  req.on("close", () => {
    clearInterval(keepAlive);
    const idx = clients.indexOf(res);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

/**
 * Redis pub/sub: forward alerts to all SSE clients
 */
subscriber.subscribe("alerts", (err) => {
  if (err) console.error("❌ Redis subscribe failed:", err);
  else console.log("✅ Subscribed to Redis channel: alerts");
});

subscriber.on("message", (channel, message) => {
  if (channel !== "alerts") return;
  console.log("📢 Alert received from Redis:", message);

  // Fan out to all connected SSE clients
  clients.forEach((client) => {
    client.write(`data: ${message}\n\n`);
  });
});

export default router;
