const { set } = require('lodash');
const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbit');

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.log(" [x] Received %s");
        }
    },
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            const notiQueue = 'notificationQueueProcess';
            //1. loi TTL
            // setTimeout( async ()=>{
            //     await channel.consume(notiQueue, function(msg) {
            //         console.log(" [x] Received %s consumerToQueueNormal", msg.content.toString());
            //         channel.ack(msg);
            //     });
            // },15000)

            //2. loi login
            await channel.consume(notiQueue, function (msg) {
               try {
                
                const numberTest = Math.random();
                console.log(numberTest);
                if (numberTest < 0.8) {
                    throw new Error('send notification failed:: HOT FIX');
                }
                console.log(" [x] Received %s consumerToQueueNormal", msg.content.toString());
                channel.ack(msg);
               } catch (error) {
                    //  console.log("send notification ferr", error);
                     channel.nack(msg,false,false);
                
               }

            });

        } catch (error) {
            console.log(" [x] Received %s", error);
        }

    },
    consumerToQueueFailed: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();

            const notificationExchaneDLX = 'notificationExchaneDLX';
            const notificationRoutingkeyDLX = 'notificationRoutingkeyDLX';

            const notiQueueHandler = 'notificationQueueHostFix';

            await channel.assertExchange(notificationExchaneDLX, 'direct', { durable: true });
            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false,//cho phép cac ket noi truy cap vao cung mot luc hang doi
            });

            await channel.bindQueue(queueResult.queue, notificationExchaneDLX, notificationRoutingkeyDLX);

            await channel.consume(queueResult.queue, function (msg) {
                console.log(" [x] Received %s consumerToQueueFailed: ", msg.content.toString());
            }, {
                noAck: true
            });

        } catch (error) {
            console.log(" [x] Received %s", error);

        }
    }
}

module.exports = messageService;