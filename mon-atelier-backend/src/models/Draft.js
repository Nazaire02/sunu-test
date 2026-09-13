import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const piece = new mongoose.Schema({ id: String, garment: String, measurements: { type: Map, of: String } }, { _id: false, strict: 'throw' });
const schema = new mongoose.Schema({ _id: identifier, ownerId: { type: String, required: true, unique: true }, clientId: { type: String, default: '' }, gender: { type: String, enum: ['Homme', 'Femme'], default: 'Femme' }, pieces: [piece], description: { type: String, default: '' }, photos: { type: [String], default: [] }, total: { type: String, default: '' }, deposit: { type: String, default: '' }, durationDays: { type: String, default: '7' }, method: { type: String, enum: ['Espèces', 'Mobile Money'], default: 'Espèces' }, requestId: { type: String, required: true } }, options);
export default mongoose.model('Draft', schema);
