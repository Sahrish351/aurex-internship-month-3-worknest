/**
 * Middleware factory to validate required body parameters
 * @param {string[]} requiredFields 
 */
const validateRequired = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Missing required field(s): ${missing.join(', ')}`,
          details: missing.map((field) => ({ field, message: `${field} is required` })),
        },
      });
    }

    next();
  };
};

module.exports = {
  validateRequired,
};
