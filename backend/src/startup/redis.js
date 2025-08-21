import { createClient } from 'redis';

let client;

export async function getRedisClient() {
	if (client) return client;
	client = createClient({ url: process.env.REDIS_URL });
	client.on('error', (err) => console.error('Redis Client Error', err));
	await client.connect();
	console.log('Redis connected');
	return client;
}

// Redis keys naming conventions
function flightKey(id) { return `flight:${id}`; }
function baggageKey(id) { return `baggage:${id}`; }

export async function redisSetFlight(flight) {
	const c = await getRedisClient();
	await c.hSet(flightKey(flight._id.toString()), {
		flightNumber: flight.flightNumber,
		airline: flight.airline,
		gate: flight.gate || '',
		status: flight.status,
		scheduledTime: new Date(flight.scheduledTime).toISOString()
	});
}

export async function redisRemoveFlight(id) {
	const c = await getRedisClient();
	await c.del(flightKey(id));
}

export async function redisSetBaggage(bag) {
	const c = await getRedisClient();
	await c.hSet(baggageKey(bag._id.toString()), {
		tagNumber: bag.tagNumber,
		flightId: bag.flightId ? bag.flightId.toString() : '',
		status: bag.status
	});
}

export async function redisRemoveBaggage(id) {
	const c = await getRedisClient();
	await c.del(baggageKey(id));
}

