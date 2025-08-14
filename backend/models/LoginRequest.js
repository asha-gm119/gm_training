import mongoose from "mongoose";

const loginRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("LoginRequest", loginRequestSchema);
