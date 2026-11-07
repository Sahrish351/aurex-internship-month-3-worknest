const { verifyToken } = require('../utils/token');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Fallback to cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required. No token provided.' },
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          message:
            err.name === 'TokenExpiredError'
              ? 'Token expired. Please login again.'
              : 'Invalid authentication token.',
        },
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'The user belonging to this token no longer exists.' },
      });
    }

    // Check account status
    if (user.status === 'inactive') {
      return res.status(401).json({
        success: false,
        error: { message: 'Your account has been deactivated. Please contact an administrator.' },
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
