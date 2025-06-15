import rateLimit from 'express-rate-limit';
import { loadServiceRegistry } from '../lib/serviceRegistry.js';

// Middleware to apply rate limiting
// Object to store rate limiters
let limiters = {};

// Initialize rate limiters
export async function initRateLimiters() {
  const registry = await loadServiceRegistry();

  // Create individual rate limiters for each service
  for (const [prefix, config] of Object.entries(registry)) {
    limiters[prefix] = rateLimit({
      windowMs: config.time * 1000, // time_window in seconds
      max: config.limit,           // max_requests
      message: `Too many requests to service "${prefix}". Please try again later.`,
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  return (req, res, next) => {
    const servicePrefix = req.path.split('/').filter(Boolean)[0];

    if (limiters[servicePrefix]) {
      return limiters[servicePrefix](req, res, next); // Apply corresponding limiter
    } else {
      return next(); // No limiter for this route
    }
  };
}
