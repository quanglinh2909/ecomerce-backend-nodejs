const amqp = require('amqplib');
const messages = 'Hello World!';

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        const queue = 'test-topic';
        await channel.assertQueue(queue, { durable: false });
        channel.consume(
            queue,
            message => {
                console.log(`Consumer received message: ${message.content.toString()}`);
            },
            { noAck: true }
        );
    } catch (error) {}
};

runConsumer().catch(console.error);
