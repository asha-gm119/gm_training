import { Router } from 'express';
import Notification from '../models/Notification.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
	const items = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
	res.json(items);
});

router.post('/', authMiddleware(['ADMIN']), async (req, res) => {
	const n = await Notification.create(req.body);
	req.app.get('io').emit('notification', n);
	res.status(201).json(n);
});

export default router;

