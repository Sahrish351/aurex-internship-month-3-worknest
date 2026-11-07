const app = require('./app');
const connectDatabase = require('./config/database');
const environment = require('./config/environment');

const startServer = async () => {
  try {
    // 1. Establish verified database connection before listening
    await connectDatabase();

    // 2. Start HTTP server
    const server = app.listen(environment.port, () => {
      console.log(`=======================================================`);
      console.log(` WorkNest API Server running in [${environment.nodeEnv}] mode`);
      console.log(` Listening on: http://localhost:${environment.port}`);
      console.log(` Health check: http://localhost:${environment.port}/api/health`);
      console.log(`=======================================================`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle Uncaught Exceptions
    process.on('uncaughtException', (err) => {
      console.error(`[Uncaught Exception] ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    console.error(`[Fatal Server Startup Error]: Could not establish MongoDB Atlas connection: ${err.message}`);
    process.exit(1);
  }
};

startServer();
