const ampq = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await ampq.connect('amqp://localhost');
    if (!connection) {
        throw new Error('Could not connect to rabbitmq');
    }
    const channel = await connection.createChannel();
   
    
    return {connection, channel};
    } catch (error) {
        
    }
    }

const connectToRabbitMQForTest = async () => {
    try {
        const {connection, channel} = await connectToRabbitMQ();
        const queue = 'test';
        const msg = 'Hello World!';
        await channel.assertQueue(queue, {
            durable: false
        });
        await channel.sendToQueue(queue, Buffer.from(msg));
        // console.log(" [x] Sent %s", msg);
        setTimeout(function() {
            connection.close();
        }, 500);

    } catch (error) {
        console.log(error);
    }
}

const consumerQueue = async (channel,queueName) => {
    try {
        await channel.assertQueue(queueName, {
            durable: true
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
        await channel.consume(queueName, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    } catch (error) {
        console.log(" [x] Received %s");
    }
}

    module.exports = {
        connectToRabbitMQ,
        connectToRabbitMQForTest,
        consumerQueue
    };