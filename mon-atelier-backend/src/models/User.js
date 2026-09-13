import mongoose from 'mongoose';
import { identifier, options } from './options.js';
const schema = new mongoose.Schema({ _id: identifier, phone: { type: String, required: true, unique: true } }, options);
export default mongoose.model('User', schema);
