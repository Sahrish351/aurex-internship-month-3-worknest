const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env regardless of execution directory
const backendEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnvPath });

// Fallback to process.cwd() .env if not found above
dotenv.config();

const environment = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worknest',
  jwtSecret: process.env.JWT_SECRET || 'worknest_super_secret_jwt_key_aurex_month_3_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = environment;
