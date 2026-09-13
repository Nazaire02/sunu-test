import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({ _id: identifier, ownerId: { type: String, required: true, unique: true, ref: 'User' }, name: { type: String, required: true }, owner: { type: String, required: true }, phone: { type: String, required: true }, city: { type: String, required: true }, address: { type: String, default: '' }, logo: { type: String, default: '' }, sequence: { type: Number, default: 0 } }, options);
export default mongoose.model('Workshop', schema);
