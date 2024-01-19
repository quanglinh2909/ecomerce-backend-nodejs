const amqp = require('amqplib');
const messages = 'Hello World!';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queue = 'test-topic';
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(messages));
        console.log(`Producer send message: ${messages}`);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {}
};

runProducer().catch(console.error);
