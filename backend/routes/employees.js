import express from "express";
import Employee from "../models/Employee.js";
import requireAuth from "../middleware/auth.js";
import cacheMiddleware from "../middleware/cache.js";
import { redisClient } from "../utils/redisClient.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", cacheMiddleware, async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }).lean();
    await redisClient.setEx("employees:all", 300, JSON.stringify(employees));
    res.json({ fromCache: false, data: employees });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res.status(400).json({ error: "name, email, department are required" });
    }
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const emp = new Employee({ name, email, department });
    await emp.save();
    await redisClient.del("employees:all");

    res.status(201).json(emp);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });
    res.json(emp);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (department) updates.department = department;

    if (email) {
      const other = await Employee.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
      if (other) return res.status(400).json({ error: "Email already in use" });
    }

    const emp = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ error: "Not found" });

    await redisClient.del("employees:all");
    res.json(emp);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });

    await redisClient.del("employees:all");
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
