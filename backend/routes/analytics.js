// routes/analytics.js
import express from "express";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Request from "../models/Request.js"; // must exist

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    // total login requests = count of request logs with path being login
    const totalLoginRequests = await Request.countDocuments({ path: "/api/auth/login" });
    const totalRequests = await Request.countDocuments();

    res.json({ totalUsers, totalEmployees, totalLoginRequests, totalRequests });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
