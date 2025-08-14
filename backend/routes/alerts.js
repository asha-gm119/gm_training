import express from "express";
const router = express.Router();

let clients = [];

router.get("/stream", (req, res) => {
  try {
    const allowedOrigin =
      process.env.CLIENT_URL || "https://radiant-otter-7af0be.netlify.app";

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send headers immediately
    if (res.flushHeaders) {
      res.flushHeaders();
    }

    // Store client
    clients.push(res);

    // Initial comment (does not break JSON parsing)
    res.write(": connected\n\n");

    // Heartbeat every 20s
    const keepAlive = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 20000);

    // On disconnect
    req.on("close", () => {
      clearInterval(keepAlive);
      clients = clients.filter((c) => c !== res);
    });
  } catch (err) {
    console.error("🔥 SSE stream error:", err);
    res.status(500).end();
  }
});

export default router;
