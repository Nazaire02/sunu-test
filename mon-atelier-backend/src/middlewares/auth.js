import { verifyToken } from '../services/tokenService.js';
import { ApiError } from '../utils/ApiError.js';
export async function auth(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) throw new ApiError(401, 'AUTH_REQUIRED', 'Connectez-vous pour continuer.');
  req.auth = await verifyToken(authorization.slice(7), 'access');
  next();
}
