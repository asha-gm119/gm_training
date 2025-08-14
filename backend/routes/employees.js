import express from "express";
import Employee from "../models/Employee.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { publisher, redisClient } from "../utils/redisClient.js";

const router = express.Router();

// Protect all employee routes
router.use(authMiddleware);

async function clearEmployeeCache() {
  await redisClient.del("employees");
}

// GET employees (cached)
router.get("/", async (req, res, next) => {
  try {
    const cached = await redisClient.get("employees");
    if (cached) {
      return res.json({
        source: "Redis (Session Cache)",
        data: JSON.parse(cached),
      });
    }

    const employees = await Employee.find().sort({ createdAt: -1 }).lean();
    await redisClient.set("employees", JSON.stringify(employees), { EX: 60 });

    res.json({ source: "MongoDB", data: employees });
  } catch (err) {
    next(err);
  }
});

// Add employee
router.post("/", async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res
        .status(400)
        .json({ error: "name, email, and department are required" });
    }

    const emp = new Employee({ name, email, department });
    await emp.save();

    const actor = req.user?.username || "unknown";
    await publisher.publish(
      "alerts",
      JSON.stringify({
        type: "employee_added",
        message: `User ${actor} added employee ${emp.name}`,
      })
    );

    await clearEmployeeCache();
    res.status(201).json(emp);
  } catch (err) {
    next(err);
  }
});

// Update employee
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const actor = req.user?.username || "unknown";
    await publisher.publish(
      "alerts",
      JSON.stringify({
        type: "employee_updated",
        message: `User ${actor} updated employee ${updated.name}`,
      })
    );

    await clearEmployeeCache();
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete employee
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const actor = req.user?.username || "unknown";
    await publisher.publish(
      "alerts",
      JSON.stringify({
        type: "employee_deleted",
        message: `User ${actor} deleted employee ${deleted.name}`,
      })
    );

    await clearEmployeeCache();
    res.json({ message: "Employee deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
});

// Debug route: check cache source
router.get("/check-session", async (req, res) => {
  try {
    const cached = await redisClient.get("employees");
    if (cached) {
      return res.json({ source: "Redis (Session Cache)" });
    }
    return res.json({ source: "MongoDB" });
  } catch (err) {
    return res
      .status(500)
      .json({ source: "Unknown (Error checking cache)" });
  }
});

export default router;
