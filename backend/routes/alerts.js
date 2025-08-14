import express from "express";
import { subscriber } from "../utils/redisClient.js";

const router = express.Router();

// List of active SSE clients
const clients = [];

/**
 * SSE stream endpoint
 */
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.flushHeaders();

  // Add this client to our list
  clients.push(res);

  // Send initial ping
  res.write(": connected\n\n");

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

/**
 * Redis pub/sub: forward messages to SSE clients
 */
subscriber.subscribe("alerts", (message) => {
  console.log("📢 Alert received from Redis:", message);

  // Fan out message to all connected clients
  clients.forEach((client) => {
    client.write(`data: ${message}\n\n`);
  });
});

export default router;
