import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({
  _id: identifier,
  phone: { type: String, required: true },
  codeHash: { type: String, required: true, select: false },
  attempts: { type: Number, default: 0 },
  state: { type: String, enum: ['sending', 'pending'], default: 'sending' },
  expiresAt: { type: Date, required: true },
}, options);
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
schema.index({ phone: 1 });
export default mongoose.model('Challenge', schema);
