/**
 * Error Handler Middleware
 */

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      error: 'A record with this value already exists',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record not found',
      code: 'NOT_FOUND'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'UNAUTHORIZED'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Stripe errors
  if (err.type === 'StripeCardError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: 'PAYMENT_ERROR'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
}

export default { errorHandler };
