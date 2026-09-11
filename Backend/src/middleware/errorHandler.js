import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

/* eslint-disable-next-line no-unused-vars */
export function errorHandler(err, req, res, next) {
  const isApiError = err.isApiError;
  const statusCode = isApiError ? err.statusCode : err.name === 'ValidationError' ? 400 : 500;

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  // Never leak stack traces, raw DB errors, or secrets to the client.
  const payload = {
    success: false,
    error: {
      message: isApiError
        ? err.message
        : statusCode === 500
        ? 'Something went wrong. Please try again later.'
        : err.message,
      ...(isApiError && err.details ? { details: err.details } : {}),
    },
  };

  if (!env.isProd && statusCode >= 500) {
    payload.error.devStack = err.stack;
  }

  res.status(statusCode).json(payload);
}
