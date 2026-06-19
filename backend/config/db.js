const mongoose = require('mongoose');

const connectDB = async () => {
  const defaultUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_management';
  try {
    // Try to connect to real MongoDB with a short timeout to fail fast
    const conn = await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Could not connect to MongoDB at ${defaultUri}: ${error.message}`);
    console.log('Attempting in-memory MongoDB fallback for demonstration...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);
      
      // Store in-memory instance globally to avoid garbage collection
      global.__MONGO_IN_MEMORY_DB__ = mongoServer;
    } catch (err) {
      console.error(`In-memory MongoDB fallback failed: ${err.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
