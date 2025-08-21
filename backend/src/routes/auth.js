import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signJwt } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
	const token = signJwt(user);
	return res.json({ token, role: user.role, name: user.name, email: user.email });
});

export default router;

