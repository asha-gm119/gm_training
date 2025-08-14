import express from "express";



const router = express.Router();
let clients = [];

// Broadcast helper
function broadcastAlert(alert) {
  const payload = `data: ${JSON.stringify(alert)}\n\n`;
  clients.forEach((res) => res.write(payload));
}

router.get("/stream", (req, res) => {
  const allowedOrigin =
    process.env.CLIENT_URL || "https://radiant-otter-7af0be.netlify.app";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  if (res.flushHeaders) res.flushHeaders();

  clients.push(res);

  res.write(": connected\n\n");

  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    clients = clients.filter((c) => c !== res);
  });
});

// Example endpoint: trigger an alert manually
router.post("/send", (req, res) => {
  const alert = {
    type: "info",
    message: req.body.message || "New alert",
    timestamp: Date.now(),
  };
  broadcastAlert(alert);
  res.json({ status: "ok" });
});

export { broadcastAlert };
export default router;
