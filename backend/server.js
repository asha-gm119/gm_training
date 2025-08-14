import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { subscriber } from "./utils/redisClient.js"; // adjust path if needed


// Store connected clients
const clients = [];

// SSE endpoint
app.get("/api/alerts/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add this client to our list
  clients.push(res);

  // Remove client when connection closes
  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

// Redis Subscriber setup
subscriber.subscribe("alerts", (message) => {
  console.log("📢 Alert received:", message);

  // Send the message to all connected SSE clients
  clients.forEach((client) => {
    client.write(`data: ${message}\n\n`);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
