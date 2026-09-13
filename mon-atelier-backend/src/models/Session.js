import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({ _id: identifier, userId: { type: String, required: true, index: true }, refreshHash: { type: String, required: true }, usedHashes: { type: [String], default: [] }, expiresAt: { type: Date, required: true }, revokedAt: { type: Date, default: null } }, options);
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('Session', schema);
