/**
 * Restrict access to specified roles.
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required prior to authorization.' },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Required: ${roles.join(', ')}.`,
        },
      });
    }

    next();
  };
};

module.exports = authorize;
