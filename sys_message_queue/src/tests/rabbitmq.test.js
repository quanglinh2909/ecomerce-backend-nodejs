const {connectToRabbitMQForTest} = require('../dbs/init.rabbit');


describe('RabbitMQ connection', () => {

    it('should connect to rabbitmq', async () => {
        const result = await connectToRabbitMQForTest();
        expect(result).toBeUndefined();
    })

})