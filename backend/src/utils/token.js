const jwt = require('jsonwebtoken');
const environment = require('../config/environment');

const generateToken = (payload) => {
  return jwt.sign(payload, environment.jwtSecret, {
    expiresIn: environment.jwtExpiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, environment.jwtSecret);
};

const getCookieOptions = () => {
  const isProduction = environment.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

module.exports = {
  generateToken,
  verifyToken,
  getCookieOptions,
};
