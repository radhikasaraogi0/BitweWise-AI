const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  const customUri = process.env.MONGODB_URI;

  if (customUri) {
    try {
      console.log(`Connecting to MongoDB URI: ${customUri.replace(/:\/\/[^@]+@/, '://***:***@')}`);
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB via provided URI');
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to provided MONGODB_URI, falling back to local/in-memory instance:', err.message);
    }
  }

  // Try standard local MongoDB
  try {
    const localUri = 'mongodb://127.0.0.1:27017/ai_food_recommender';
    console.log(`Attempting connection to local MongoDB: ${localUri}`);
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('✅ Connected to local MongoDB daemon');
    return;
  } catch (localErr) {
    console.log('ℹ️ Local MongoDB daemon not active, starting embedded MongoDB In-Memory Server...');
  }

  // Fallback to MongoMemoryServer
  try {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Connected to Embedded In-Memory MongoDB (${memoryUri})`);
  } catch (memErr) {
    console.error('❌ Failed to start In-Memory MongoDB:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
