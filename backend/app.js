import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import rateLimit from "express-rate-limit";
import connectRedis from "connect-redis";
import { redisClient } from "./utils/redisClient.js";
import employeeRoutes from "./routes/employees.js";
import authRoutes from "./routes/auth.js"; // ✅ auth route
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimiter from "./middleware/rateLimiter.js";
import apiCounter from "./middleware/apiCounter.js";




dotenv.config();
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Security and body parsing
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter); 
app.use(apiCounter);

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Session store (connect-redis@7 style)
const RedisStore = connectRedis; // ✅ class-based, no function call
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 }
}));


app.use(cors({
  origin: "http://localhost:3000", // React frontend URL
  credentials: true // allow cookies/session to be sent
}));


// Routes
app.use("/api/auth", authRoutes);       // ✅ auth API
app.use("/api/employees", employeeRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
