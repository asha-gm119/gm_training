import { Kafka } from 'kafkajs';

let kafka;
let producer;

export async function initKafka() {
	kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
	producer = kafka.producer();
	await producer.connect();
	console.log('Kafka producer connected');
}

export async function registerKafkaConsumers(io) {
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
		if (!producer) throw new Error('Kafka not initialized');
		await producer.send({ topic, messages });
	}
};

