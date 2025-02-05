const { MongoClient } = require('mongodb');
const config = require('./config-back');

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

const fetchCodeBlock = async (id) => {
    const codeBlocksCollection = client.db("code-blocks").collection("online-code-review");
    const codeBlock = await codeBlocksCollection.findOne({
      id
    });
    return codeBlock;
};

const addCodeBlock = async (codeBlock) => {
    const codeBlocksCollection = client.db("code-blocks").collection("online-code-review");
    const result = await codeBlocksCollection.insertOne(codeBlock);
    console.log('Code block added:', result);
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

const numberOfCodeBlocks = async () => {
    const codeBlocksCollection = client.db("code-blocks").collection("online-code-review");
    const count = await codeBlocksCollection.countDocuments();
    return count;
  };

module.exports = {
  connectToMongo,
  fetchCodeBlocks,
  fetchCodeBlock,
  clearData,
  addCodeBlock,
  numberOfCodeBlocks
};
