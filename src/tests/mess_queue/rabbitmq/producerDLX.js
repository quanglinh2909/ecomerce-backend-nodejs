const amqp = require('amqplib');
const messages = 'Hello World!';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();

        const notificationExchane = 'notificationExchane';
        const notiQueue = 'notificationQueueProcess';
        const notificationExchaneDLX = 'notificationExchaneDLX';
        const notificationRoutingkeyDLX = 'notificationRoutingkeyDLX';

        await channel.assertExchange(notificationExchane, 'direct', { durable: true });
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,//cho phép cac ket noi truy cap vao cung mot luc hang doi
            deadLetterExchange: notificationExchaneDLX,//khi hang doi bi loi thi se gui den hang doi khac
            deadLetterRoutingKey: notificationRoutingkeyDLX//
        });

        await channel.bindQueue(queueResult.queue, notificationExchane);

        const msg = 'a new product has been created';
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
            expiration: 10000
        });



        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) { }
};

runProducer().catch(console.error);
