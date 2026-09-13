import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({ _id: identifier, ownerId: { type: String, required: true, index: true }, mime: { type: String, default: 'image/webp' }, data: { type: Buffer, required: true, select: false }, size: { type: Number, required: true } }, options);
export default mongoose.model('Media', schema);
