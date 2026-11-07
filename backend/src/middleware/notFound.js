const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
};

module.exports = notFound;
