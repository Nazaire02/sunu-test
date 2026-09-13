import { randomUUID, randomInt, createHmac } from 'node:crypto';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { verificationProvider } from './verificationService.js';
import { consumeLimit, consumeCooldown } from './rateLimitService.js';
import { signToken } from './tokenService.js';
import { config } from '../config/index.js';
import { hash, secret } from '../utils/crypto.js';
import { ApiError } from '../utils/ApiError.js';

function codeHash(challengeId, code) {
  return createHmac('sha256', config.JWT_SECRET).update(`otp:${challengeId}:${code}`).digest('hex');
}
export async function requestCode(phone) {
  await consumeCooldown('otp-phone-cooldown', phone, 60);
  await consumeLimit('sms-phone-day', phone, 10, 86400);
  const challengeId = randomUUID();
  const code = String(randomInt(0, 1000000)).padStart(6, '0');
  console.log(code)
  const expiresAt = new Date(Date.now() + 600000);
  await Challenge.deleteMany({ phone });
  await Challenge.create({ _id: challengeId, phone, codeHash: codeHash(challengeId, code), expiresAt });
  try {
    // await verificationProvider.send(phone, code);
    await Challenge.updateOne({ _id: challengeId }, { state: 'pending' });
  } catch (error) {
    await Challenge.deleteOne({ _id: challengeId });
    throw error;
  }
  return { challengeId, expiresAt: expiresAt.toISOString(), retryAfter: 60 };
}
async function tokens(user, session, refreshToken) {
  return { accessToken: await signToken(user._id, session, 'access'), refreshToken, expiresIn: Math.min(config.accessSeconds, Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000))), sessionExpiresAt: session.expiresAt.toISOString(), user: { id: user._id, phone: user.phone } };
}
export async function verifyCode(challengeId, code) {
  const expectedHash = codeHash(challengeId, code);
  const attempt = await Challenge.findOneAndUpdate(
    { _id: challengeId, state: 'pending', attempts: { $lt: 5 }, expiresAt: { $gt: new Date() } },
    { $inc: { attempts: 1 } },
    { returnDocument: 'after' },
  );
  if (!attempt) throw new ApiError(401, 'OTP_INVALID', 'Code expiré ou trop de tentatives. Demandez un nouveau code.');
  const challenge = await Challenge.findOneAndDelete({
    _id: challengeId, codeHash: expectedHash, state: 'pending',
    attempts: { $lte: 5 }, expiresAt: { $gt: new Date() },
  });
  if (!challenge) {
    await Challenge.deleteOne({ _id: challengeId, attempts: { $gte: 5 } });
    throw new ApiError(401, 'OTP_INVALID', 'Le code saisi est incorrect ou expiré.');
  }
  let user;
  try { user = await User.findOneAndUpdate({ phone: challenge.phone }, { $setOnInsert: { phone: challenge.phone } }, { upsert: true, returnDocument: 'after' }); }
  catch (error) { if (error.code !== 11000) throw error; user = await User.findOne({ phone: challenge.phone }); }
  const sessionId = randomUUID();
  const refreshToken = `${sessionId}.${secret()}`;
  const session = await Session.create({ _id: sessionId, userId: user._id, refreshHash: hash(refreshToken), expiresAt: new Date(Date.now() + config.sessionSeconds * 1000) });
  return tokens(user, session, refreshToken);
}
export async function refreshSession(refreshToken) {
  const sessionId = refreshToken.split('.')[0];
  const currentHash = hash(refreshToken);
  const nextToken = `${sessionId}.${secret()}`;
  const session = await Session.findOneAndUpdate({ _id: sessionId, refreshHash: currentHash, revokedAt: null, expiresAt: { $gt: new Date() } }, { $set: { refreshHash: hash(nextToken) }, $push: { usedHashes: currentHash } }, { returnDocument: 'after' });
  if (!session) {
    await Session.updateOne({ _id: sessionId, usedHashes: currentHash, revokedAt: null }, { revokedAt: new Date() });
    throw new ApiError(401, 'SESSION_EXPIRED', 'Votre session a expiré. Reconnectez-vous.');
  }
  const user = await User.findById(session.userId);
  if (!user) { await Session.updateOne({ _id: sessionId }, { revokedAt: new Date() }); throw new ApiError(401, 'SESSION_EXPIRED', 'Session invalide.'); }
  return tokens(user, session, nextToken);
}
export async function logoutSession(refreshToken) {
  const sessionId = refreshToken.split('.')[0];
  const tokenHash = hash(refreshToken);
  await Session.updateOne({ _id: sessionId, $or: [{ refreshHash: tokenHash }, { usedHashes: tokenHash }] }, { revokedAt: new Date() });
}
