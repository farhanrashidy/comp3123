// Return a consistent response for unknown routes.
function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} was not found`,
    },
  });
}

// Convert application errors into a consistent JSON response.
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status =
    err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  const fields = err.name === 'ValidationError'
    ? Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }))
    : undefined;
  const message = status >= 500 ? 'An unexpected server error occurred' : err.message;
  req.log?.('error', `request_failed status=${status} code=${err.code || err.name || 'ERROR'}`);
  res.status(status).json({
    error: {
      code: err.code || 'REQUEST_ERROR',
      message,
      ...(fields ? { fields } : {}),
    },
  });
}

module.exports = { notFound, errorHandler };
