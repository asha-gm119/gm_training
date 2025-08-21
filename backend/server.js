import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { createClient as createRedisClient } from 'redis';
import { Kafka } from 'kafkajs';

import authRouter from './src/routes/auth.js';
import usersRouter from './src/routes/users.js';
import flightsRouter from './src/routes/flights.js';
import baggageRouter from './src/routes/baggage.js';
import { seedAdminIfNeeded } from './src/startup/seedAdmin.js';
import { initKafka, kafkaProducer, registerKafkaConsumers } from './src/startup/kafka.js';
import { getRedisClient } from './src/startup/redis.js';
import { authMiddleware } from './src/middleware/auth.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: process.env.CORS_ORIGIN || '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	}
});

app.set('io', io);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', authMiddleware(['ADMIN']), usersRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/baggage', baggageRouter);

const PORT = process.env.PORT || 4000;

async function start() {
	await mongoose.connect(process.env.MONGO_URI);
	await getRedisClient();
	await initKafka();
	await registerKafkaConsumers(io);

	await seedAdminIfNeeded();

	server.listen(PORT, () => {
		console.log(`Backend listening on ${PORT}`);
	});
}

start().catch((err) => {
	console.error('Fatal start error', err);
	process.exit(1);
});

