const app = require('./app');
const connectDatabase = require('./config/database');
const environment = require('./config/environment');

const startServer = async () => {
  try {
    // 1. Establish database connection (non-fatal so server can bind port and report diagnostics)
    try {
      await connectDatabase();
    } catch (dbErr) {
      console.error(`[MongoDB Atlas Startup Error]: ${dbErr.message}`);
      console.warn('[Server Diagnostics]: Continuing to start HTTP server so port binds and health checks are accessible.');
    }

    // 2. Start HTTP server binding to 0.0.0.0 for containerized environments (Render / Docker)
    const server = app.listen(environment.port, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(` WorkNest API Server running in [${environment.nodeEnv}] mode`);
      console.log(` Listening on: http://0.0.0.0:${environment.port}`);
      console.log(` Health check: http://0.0.0.0:${environment.port}/api/health`);
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
