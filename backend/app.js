import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import rateLimit from "express-rate-limit";
import connectRedis from "connect-redis";
import { redisClient } from "./utils/redisClient.js";
import employeeRoutes from "./routes/employees.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import apiCounter from "./middleware/apiCounter.js";
import alertsRoutes from "./routes/alerts.js";
import analyticsRoutes from "./routes/analytics.js";
import requestLogger from "./middleware/requestLogger.js";
import { requestCounter } from "./middleware/requestCounter.js";
import testRoutes from "./routes/test.js";
import testRateLimitRoutes from "./routes/testRateLimt.js";

dotenv.config();
const app = express();

// ----------------- DB -----------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ----------------- Middleware -----------------
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(apiCounter);
app.use(requestCounter);

// ----------------- CORS -----------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://hilarious-sorbet-eb5396.netlify.app",
  "https://lively-faun-e79255.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy does not allow this origin: " + origin), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Explicitly handle preflight
app.options("*", cors());

// ----------------- Rate Limiting -----------------
// Skip rate limiter for SSE stream
app.use((req, res, next) => {
  if (req.path === "/api/alerts/stream") {
    return next();
  }
  return rateLimiter(req, res, next);
});

// Login-specific rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10000000,
  message: "Too many requests, please try again later."
});
app.use("/api/auth/login", limiter);

// ----------------- Session with Redis -----------------
const RedisStore = connectRedis;
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 }
  })
);

// ----------------- Routes -----------------
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", testRoutes);
app.use("/api", testRateLimitRoutes);

// ----------------- Request Logger -----------------
app.use(requestLogger);

// ----------------- Global Error Handler -----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
