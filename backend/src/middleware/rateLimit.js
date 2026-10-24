/**
 * Rate Limiting Middleware
 */

const rateLimitStore = new Map();

export function apiRateLimit(req, res, next) {
  if (process.env.NODE_ENV === 'test') return next();

  const key = req.user?.id || req.ip;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = req.user ? 100 : 30;

  let record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(key, record);
  }

  record.count++;

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));

  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      code: 'RATE_LIMITED',
      retryAfter: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  next();
}

// Cleanup old entries
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt + 60000) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Don't keep the process alive just for this timer
cleanup.unref();

export default { apiRateLimit };
