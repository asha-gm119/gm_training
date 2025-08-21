import { createClient } from 'redis';

let client;
const flightsMap = new Map();
const baggageMap = new Map();

export async function getRedisClient() {
	if (process.env.USE_INMEMORY === '1') {
		console.log('Using in-memory cache (Redis disabled)');
		return null;
	}
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
	if (process.env.USE_INMEMORY === '1') {
		flightsMap.set(flight._id.toString(), {
			flightNumber: flight.flightNumber,
			airline: flight.airline,
			gate: flight.gate || '',
			status: flight.status,
			scheduledTime: new Date(flight.scheduledTime).toISOString()
		});
		return;
	}
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
	if (process.env.USE_INMEMORY === '1') {
		flightsMap.delete(id);
		return;
	}
	const c = await getRedisClient();
	await c.del(flightKey(id));
}

export async function redisSetBaggage(bag) {
	if (process.env.USE_INMEMORY === '1') {
		baggageMap.set(bag._id.toString(), {
			tagNumber: bag.tagNumber,
			flightId: bag.flightId ? bag.flightId.toString() : '',
			status: bag.status
		});
		return;
	}
	const c = await getRedisClient();
	await c.hSet(baggageKey(bag._id.toString()), {
		tagNumber: bag.tagNumber,
		flightId: bag.flightId ? bag.flightId.toString() : '',
		status: bag.status
	});
}

export async function redisRemoveBaggage(id) {
	if (process.env.USE_INMEMORY === '1') {
		baggageMap.delete(id);
		return;
	}
	const c = await getRedisClient();
	await c.del(baggageKey(id));
}

