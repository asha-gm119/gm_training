import express from 'express';
import { subscriber } from '../utils/redisClient.js';

const router = express.Router();

router.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");

    const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
  }, 20000);

  // Close on client disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
  });

  // Send a comment to keep connection alive
  res.write(': connected\n\n');

  await subscriber.subscribe('alerts', (message) => {
    res.write(`data: ${message}\n\n`);
  });
});

export default router;
