const {consumerToQueue,consumerToQueueFailed,consumerToQueueNormal}  = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';
consumerToQueue(queueName).then(() => {
    console.log('consumerQueue');
}).catch((error) => {
    console.log(error);
});

consumerToQueueNormal(queueName).then(() => {
    console.log('consumerQueue');
}).catch((error) => {
    console.log(error);
});

consumerToQueueFailed(queueName).then(() => {
    console.log('consumerQueue');
}).catch((error) => {
    console.log(error);
});