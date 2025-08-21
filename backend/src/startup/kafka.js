import { Kafka } from 'kafkajs';

let kafka;
let producer;
let ioRef = null;

export async function initKafka() {
	if (process.env.USE_INMEMORY === '1') {
		console.log('Using in-memory event bus (Kafka disabled)');
		return;
	}
	kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
	producer = kafka.producer();
	await producer.connect();
	console.log('Kafka producer connected');
}

export async function registerKafkaConsumers(io) {
	ioRef = io;
	if (process.env.USE_INMEMORY === '1') {
		console.log('In-memory consumer active (no Kafka)');
		return;
	}
	const consumer = kafka.consumer({ groupId: 'airport-ops-group' });
	await consumer.connect();
	await consumer.subscribe({ topic: 'flight-events', fromBeginning: false });
	await consumer.subscribe({ topic: 'baggage-events', fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			try {
				const event = JSON.parse(message.value.toString());
				io.emit('event', { topic, ...event });
			} catch (e) {
				console.error('Kafka message error', e);
			}
		}
	});
	console.log('Kafka consumer running');
}

export const kafkaProducer = {
	send: async ({ topic, messages }) => {
		if (process.env.USE_INMEMORY === '1') {
			for (const m of messages) {
				try {
					const value = typeof m.value === 'string' ? m.value : JSON.stringify(m.value);
					const event = JSON.parse(value);
					ioRef && ioRef.emit('event', { topic, ...event });
				} catch (e) {
					console.error('In-memory emit error', e);
				}
			}
			return;
		}
		if (!producer) throw new Error('Kafka not initialized');
		await producer.send({ topic, messages });
	}
};

