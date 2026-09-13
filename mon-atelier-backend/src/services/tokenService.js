import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config/index.js';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
const key = new TextEncoder().encode(config.JWT_SECRET);
const issuer = 'les-tailleurs-api';
export async function signToken(userId, session, audience, extra = {}) {
  const maximum = Math.floor(session.expiresAt.getTime() / 1000);
  const expires = audience === 'access' ? Math.min(Math.floor(Date.now() / 1000) + config.accessSeconds, maximum) : maximum;
  return new SignJWT({ sid: session._id, ...extra }).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime(expires).sign(key);
}
export async function verifyToken(token, audience) {
  let payload;
  try { ({ payload } = await jwtVerify(token, key, { algorithms: ['HS256'], issuer, audience })); }
  catch { throw new ApiError(401, 'TOKEN_INVALID', 'Votre session a expiré. Reconnectez-vous.'); }
  if (typeof payload.sub !== 'string' || typeof payload.sid !== 'string') throw new ApiError(401, 'TOKEN_INVALID', 'Session invalide.');
  const session = await Session.findOne({ _id: payload.sid, userId: payload.sub, revokedAt: null, expiresAt: { $gt: new Date() } });
  if (!session) throw new ApiError(401, 'SESSION_EXPIRED', 'Votre session a expiré. Reconnectez-vous.');
  return { userId: payload.sub, session, payload };
}
