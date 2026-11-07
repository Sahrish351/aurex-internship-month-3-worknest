const dns = require('dns');
const mongoose = require('mongoose');
const environment = require('./environment');

// Ensure SRV records for MongoDB Atlas resolve reliably across local DNS providers on Windows
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (dnsErr) {
    // Ignore if custom DNS cannot be set
  }
}

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(environment.mongodbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    // Execute real MongoDB ping to verify actual roundtrip reachability
    const adminDb = conn.connection.db.admin();
    const pingResult = await adminDb.ping();

    console.log(`[MongoDB Atlas] Successfully connected to host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    console.log(`[MongoDB Atlas] Ping response: ${JSON.stringify(pingResult)}`);

    global.lastDbError = null;
    return conn;
  } catch (error) {
    global.lastDbError = error.message;
    console.error(`[MongoDB Connection Error] Failed to connect: ${error.message}`);
    throw error;
  }
};

// Connection lifecycle events
mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Runtime Error]: ${err.message}`);
});

// Graceful shutdown
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed through graceful shutdown.');
  } catch (err) {
    console.error(`[MongoDB Shutdown Error]: ${err.message}`);
  }
};

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

module.exports = connectDatabase;
