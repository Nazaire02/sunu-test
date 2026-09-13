import { consumeLimit } from '../services/rateLimitService.js';
export function rateLimit(scope, limit, seconds) {
  return async (req, res, next) => { await consumeLimit(scope, req.ip ?? 'unknown', limit, seconds); next(); };
}
