import ApiError from "../utils/ApiError.js";

// Handle undefined routes
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralised error-handling middleware
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error.";
  let details = err.details || undefined;

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed.";

    details = Object.values(err.errors).map((error) => error.message);
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  // Duplicate database records
  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists.";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired authentication token.";
  }

  // Log errors in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};

// Default export for app.js compatibility
export default errorHandler;
