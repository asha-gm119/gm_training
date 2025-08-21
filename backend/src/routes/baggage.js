import { Router } from 'express';
import Baggage from '../models/Baggage.js';
import Flight from '../models/Flight.js';
import { authMiddleware } from '../middleware/auth.js';
import { kafkaProducer } from '../startup/kafka.js';
import { redisSetBaggage, redisRemoveBaggage } from '../startup/redis.js';
import Notification from '../models/Notification.js';

const router = Router();

// Public list query by flight
router.get('/', async (req, res) => {
	const { flightId } = req.query;
	const q = flightId ? { flightId } : {};
	const items = await Baggage.find(q).sort({ createdAt: -1 });
	res.json(items);
});

router.post('/', authMiddleware(['BAGGAGE', 'ADMIN']), async (req, res) => {
	const { tagNumber, flightId } = req.body;
	if (flightId) {
		const f = await Flight.findById(flightId);
		if (!f) return res.status(400).json({ error: 'Invalid flightId' });
	}
	const bag = await Baggage.create({ tagNumber, flightId });
	await kafkaProducer.send({ topic: 'baggage-events', messages: [{ key: 'baggage-created', value: JSON.stringify({ type: 'baggage-created', baggage: bag }) }] });
	await redisSetBaggage(bag);
	res.status(201).json(bag);
});

router.put('/:id/status', authMiddleware(['BAGGAGE', 'ADMIN']), async (req, res) => {
	const { status, flightId } = req.body;
	const bag = await Baggage.findByIdAndUpdate(req.params.id, { status, flightId }, { new: true });
	if (!bag) return res.status(404).json({ error: 'Not found' });
	await kafkaProducer.send({ topic: 'baggage-events', messages: [{ key: 'baggage-updated', value: JSON.stringify({ type: 'baggage-updated', baggage: bag }) }] });
	await redisSetBaggage(bag);
	if (status === 'AT_BELT') {
		const flight = bag.flightId ? await Flight.findById(bag.flightId) : null;
		const msg = `Baggage ${bag.tagNumber} available at belt for ${flight ? flight.flightNumber : 'unassigned flight'}`;
		const note = await Notification.create({ type: 'BAGGAGE_BELT', message: msg, audience: 'PASSENGERS', flightId: bag.flightId || undefined });
		req.app.get('io').emit('notification', note);
	}
	res.json(bag);
});

router.delete('/:id', authMiddleware(['ADMIN']), async (req, res) => {
	const bag = await Baggage.findByIdAndDelete(req.params.id);
	if (!bag) return res.status(404).json({ error: 'Not found' });
	await kafkaProducer.send({ topic: 'baggage-events', messages: [{ key: 'baggage-deleted', value: JSON.stringify({ type: 'baggage-deleted', baggageId: bag._id }) }] });
	await redisRemoveBaggage(bag._id.toString());
	res.json({ ok: true });
});

export default router;

