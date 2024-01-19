const amqp = require('amqplib');
async function consumerOderdMessage(){
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const queueName = 'oder-queued-message';
    await channel.assertQueue(queueName, {
        durable: true
    });

    for(let i = 0; i < 10; i++){
        const message = 'oder-queued-message: ' + i;
        console.log(message);
        channel.sendToQueue(queueName, Buffer.from(message),{
            persistent: true
        });
    }
    setTimeout(function() {
        connection.close();
    }, 500);

}

consumerOderdMessage().catch(console.error);