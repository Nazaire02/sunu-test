import mongoose from 'mongoose';
import { config } from './index.js';

mongoose.set('strictQuery', true);
export async function connectDatabase() {
  await mongoose.connect(config.MONGODB_URI, { autoIndex: config.NODE_ENV !== 'production', maxPoolSize: 20, serverSelectionTimeoutMS: 10000 });
}
export async function disconnectDatabase() { await mongoose.disconnect(); }
