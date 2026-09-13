import * as service from '../services/authService.js';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
const cookieName = 'atelier_refresh';
const cookieOptions = { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax', path: '/api/v1/auth' };
function cookieToken(req) {
  const cookie = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  if (!cookie) return undefined;
  const origin = req.get('Origin');
  if (!origin || (!config.origins.includes(origin) && origin !== new URL(config.PUBLIC_URL).origin)) throw new ApiError(403, 'ORIGIN_FORBIDDEN', 'Origine non autorisée.');
  try { return decodeURIComponent(cookie.slice(cookieName.length + 1)); } catch { return undefined; }
}
function tokenFrom(req) {
  const token = req.validated.body.refreshToken ?? cookieToken(req);
  if (typeof token !== 'string' || token.length < 80 || token.length > 150) throw new ApiError(401, 'SESSION_EXPIRED', 'Reconnectez-vous pour continuer.');
  return token;
}
function respond(req, res, result) {
  res.set('Cache-Control', 'no-store');
  if (req.get('X-Client-Platform') === 'web') {
    res.cookie(cookieName, result.refreshToken, { ...cookieOptions, expires: new Date(result.sessionExpiresAt) });
    const { refreshToken, ...publicResult } = result;
    return res.json({ data: publicResult });
  }
  return res.json({ data: result });
}
export async function requestCode(req, res) { res.json({ data: await service.requestCode(req.validated.body.phone) }); }
export async function verifyCode(req, res) { const { challengeId, code } = req.validated.body; respond(req, res, await service.verifyCode(challengeId, code)); }
export async function refresh(req, res) { respond(req, res, await service.refreshSession(tokenFrom(req))); }
export async function logout(req, res) { const token = tokenFrom(req); await service.logoutSession(token); res.clearCookie(cookieName, cookieOptions); res.status(204).end(); }
