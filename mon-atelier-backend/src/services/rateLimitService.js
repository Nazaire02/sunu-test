import RateLimit from '../models/RateLimit.js';
import { hash } from '../utils/crypto.js';
import { ApiError } from '../utils/ApiError.js';
export async function consumeLimit(scope, key, limit, seconds) {
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const id = hash(`${scope}:${key}:${bucket}`);
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * seconds * 1000) } };
  let record;
  try { record = await RateLimit.findByIdAndUpdate(id, update, { upsert: true, returnDocument: 'after' }); }
  catch (error) { if (error.code !== 11000) throw error; record = await RateLimit.findByIdAndUpdate(id, { $inc: { count: 1 } }, { returnDocument: 'after' }); }
  if (record.count > limit) throw new ApiError(429, 'RATE_LIMITED', 'Trop de tentatives. Réessayez plus tard.');
}

export async function consumeCooldown(scope, key, seconds) {
  const now = new Date();
  const id = hash(`${scope}:${key}`);
  try {
    await RateLimit.findOneAndUpdate(
      { _id: id, expiresAt: { $lte: now } },
      { $set: { expiresAt: new Date(now.getTime() + seconds * 1000), count: 1 } },
      { upsert: true, returnDocument: 'after' },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    throw new ApiError(429, 'OTP_COOLDOWN', 'Patientez au moins une minute avant de demander un nouveau code.');
  }
}
