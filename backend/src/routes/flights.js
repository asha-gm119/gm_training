import { Router } from 'express';
import Flight from '../models/Flight.js';
import { authMiddleware } from '../middleware/auth.js';
import { kafkaProducer } from '../startup/kafka.js';
import { redisSetFlight, redisRemoveFlight } from '../startup/redis.js';

const router = Router();

// Public list for dashboard/passengers
router.get('/', async (_req, res) => {
	const flights = await Flight.find({}).sort({ scheduledTime: 1 });
	res.json(flights);
});

// Airline staff create/update
router.post('/', authMiddleware(['AIRLINE', 'ADMIN']), async (req, res) => {
	const { flightNumber, airline, gate, status, scheduledTime } = req.body;
	const flight = await Flight.create({ flightNumber, airline, gate, status, scheduledTime });
	await kafkaProducer.send({ topic: 'flight-events', messages: [{ key: 'flight-created', value: JSON.stringify({ type: 'flight-created', flight }) }] });
	await redisSetFlight(flight);
	res.status(201).json(flight);
});

router.put('/:id', authMiddleware(['AIRLINE', 'ADMIN']), async (req, res) => {
	const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if (!flight) return res.status(404).json({ error: 'Not found' });
	const type = req.body.status === 'DELAYED' ? 'flight-delayed' : 'flight-updated';
	await kafkaProducer.send({ topic: 'flight-events', messages: [{ key: type, value: JSON.stringify({ type, flight }) }] });
	await redisSetFlight(flight);
	res.json(flight);
});

router.delete('/:id', authMiddleware(['ADMIN']), async (req, res) => {
	const flight = await Flight.findByIdAndDelete(req.params.id);
	if (!flight) return res.status(404).json({ error: 'Not found' });
	await kafkaProducer.send({ topic: 'flight-events', messages: [{ key: 'flight-deleted', value: JSON.stringify({ type: 'flight-deleted', flightId: flight._id }) }] });
	await redisRemoveFlight(flight._id.toString());
	res.json({ ok: true });
});

export default router;

