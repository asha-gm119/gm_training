import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = Router();

// Admin-only: create user with role AIRLINE or BAGGAGE
router.post('/', async (req, res) => {
	const { name, email, password, role } = req.body;
	if (!['AIRLINE', 'BAGGAGE'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
	const existing = await User.findOne({ email });
	if (existing) return res.status(409).json({ error: 'Email already in use' });
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role });
	res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

router.get('/', async (_req, res) => {
	const users = await User.find({}, 'name email role createdAt');
	res.json(users);
});

export default router;

