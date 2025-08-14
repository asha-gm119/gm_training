// models/Request.js
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  method: { type: String },
  path: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Request", RequestSchema);
