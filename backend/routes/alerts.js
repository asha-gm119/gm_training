import express from "express";
import { subscriber } from "../utils/redisClient.js";

const router = express.Router();

// Track connected SSE clients
const clients = [];

/**
 * SSE endpoint
 */
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 🔥 Must be exact frontend origin (not "*") if using withCredentials:true
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.flushHeaders();

  clients.push(res);

  // Send initial connection event
  res.write(
    `data: ${JSON.stringify({ type: "connected", message: "SSE stream established" })}\n\n`
  );

  // Keep alive with ping
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    const idx = clients.indexOf(res);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

/**
 * Redis pub/sub forwarding
 */
(async () => {
  // Ensure Redis subscriber is connected
  if (!subscriber.isOpen) {
    await subscriber.connect();
  }

  await subscriber.subscribe("alerts", (message) => {
    console.log("📢 Alert received from Redis:", message);

    clients.forEach((client) => {
      client.write(`data: ${message}\n\n`);
    });
  });
})();

export default router;
