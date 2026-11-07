const mongoose = require('mongoose');
const environment = require('./environment');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(environment.mongodbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // If not in test environment, allow connection retry or throw
    if (environment.nodeEnv !== 'test') {
      console.warn('[MongoDB] Running without persistent DB or check MongoDB connection string.');
    }
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection reconnected.');
});

module.exports = connectDatabase;
