const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: ['localhost:9092'],  // Replace with your Kafka broker addresses
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
});

const producer = kafka.producer();

const produceMessage = async (topic, userId, userJson) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            {
                key: userId.toString(),
                value: JSON.stringify({ userId, userJson })
            }
        ]
    });
    await producer.disconnect();
};

module.exports = {
    produceMessage
};
