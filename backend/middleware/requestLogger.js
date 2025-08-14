import Request from "../models/Request.js";

export default async function requestLogger(req, res, next) {
  try {
    await Request.create({
      method: req.method,
      path: req.originalUrl,
      user: req.session?.userId || null, // store user ID if logged in
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Failed to log request:", err.message);
  }
  next();
}
