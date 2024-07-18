const { MongoClient } = require('mongodb');
const config = require('./config');

const mongoDBUrl = config.backend.mongoURI;

const client = new MongoClient(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

const fetchCodeBlocks = async () => {
  const codeBlocksCollection = client.db("code-blocks").collection("online-code-review");
  const codeBlocks = await codeBlocksCollection.find({}).toArray();
  return codeBlocks;
};



async function clearData() {
    try {
        const database = client.db('code-blocks');
        const collection = database.collection('online-code-review');
        const result = await collection.deleteMany({});
        console.log('Data cleared:', result);
        } catch (error) {
        console.error('Failed to clear data:', error);
    }
}

module.exports = {
  connectToMongo,
  fetchCodeBlocks,
  clearData
};
