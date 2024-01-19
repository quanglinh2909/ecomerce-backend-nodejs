const mongoose = require('mongoose');
const connectString = 'mongodb://root:1@localhost:27017';

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('MongoDB connection', () => {
    let connection;
    beforeAll(async () => {
        connection = await mongoose.connect(connectString);
    });
    afterAll(async () => {
        await connection.disconnect();
    });
    it('should connect to mongodb', async () => {
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should create a new document', async () => {
        const doc = new Test({ name: 'test' });
        await doc.save();
        expect(doc.isNew).toBe(false);
    });

    it ('should find a document', async () => {
        const doc = await Test.findOne({ name: 'test' });
        expect(doc).toBeDefined();
        expect(doc.name).toBe('test');
    })

    it('delete a document', async () => {
        const doc = await Test.deleteMany({ name: 'test' });
        expect(doc).toBeDefined();
    })
        
})