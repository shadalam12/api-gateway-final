import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../cache/redisSetup.js';

// Middleware to apply rate limiting
export const rateLimiter = (req, res, next) => {
  const user = req.user || {}; // comes from JWT middleware
  const role = user.role || 'guest'; // e.g., 'free', 'pro', etc.
  const userId = user.id || req.ip;

  // Role-based limits
  const limits = {
    guest: 50,
    free: 100,
    pro: 1000
  };

  // Get the rate limit for the user's role
  const maxRequests = limits[role] || limits['guest'];

  const limiter = rateLimit({
    store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: maxRequests,
    keyGenerator: () => userId,
    message: {
      status: 429,
      error: `Too many requests. Your plan (${role}) allows only ${maxRequests} requests per 15 minutes.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return limiter(req, res, next);
};
