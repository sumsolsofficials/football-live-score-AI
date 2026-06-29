/**
 * errorHandler.js
 * ---------------
 * Global Express error-handling middleware.
 * Must be registered LAST (after all routes) in app.js / index.js.
 *
 * Usage:
 *   app.use(errorHandler);
 */

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err.stack || err.message);

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * 404 handler — register before errorHandler but after all routes.
 */
export function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
}