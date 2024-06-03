const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'test-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-signin', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

runConsumer().catch(console.error);