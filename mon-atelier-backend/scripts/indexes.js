import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import '../src/app.js';
import mongoose from 'mongoose';
try {
  await connectDatabase();
  for (const model of Object.values(mongoose.models)) await model.createIndexes();
  console.log('Index MongoDB créés.');
} finally { await disconnectDatabase(); }
