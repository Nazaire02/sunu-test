import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({ _id: identifier, ownerId: { type: String, required: true, ref: 'User' }, name: { type: String, required: true }, phone: { type: String, required: true }, gender: { type: String, enum: ['Homme', 'Femme'], required: true }, address: { type: String, default: '' }, notes: { type: String, default: '' } }, options);
schema.index({ ownerId: 1, phone: 1 }, { unique: true });
schema.index({ ownerId: 1, createdAt: -1, _id: -1 });
export default mongoose.model('Client', schema);
