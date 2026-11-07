const environment = require('../config/environment');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error stack for developer debugging
  if (environment.nodeEnv !== 'test') {
    console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of '${err.value}'`;
    return res.status(404).json({
      success: false,
      error: { message, code: 'RESOURCE_NOT_FOUND' },
    });
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `A resource with that ${field} already exists.`;
    return res.status(409).json({
      success: false,
      error: { message, code: 'DUPLICATE_RESOURCE', field },
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed for one or more fields.',
        code: 'VALIDATION_ERROR',
        details,
      },
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid authentication token.', code: 'INVALID_TOKEN' },
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      message: error.message || 'Internal server error.',
      code: 'SERVER_ERROR',
      ...(environment.nodeEnv === 'development' ? { stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
