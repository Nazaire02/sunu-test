import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import { requestLogger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimit } from './middlewares/rateLimit.js';
import { ApiError } from './utils/ApiError.js';
import routes from './routes/index.js';
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.TRUST_PROXY_HOPS);
  app.use(requestLogger);
  app.use(helmet());
  app.use(cors({ origin: (origin, callback) => { if (!origin || config.origins.includes(origin)) callback(null, true); else callback(new ApiError(403, 'ORIGIN_FORBIDDEN', 'Origine non autorisée.')); }, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Platform'] }));
  app.get('/health/live', (req, res) => res.json({ status: 'ok' }));
  app.get('/health/ready', async (req, res) => { try { if (mongoose.connection.readyState !== 1) throw new Error('db'); await mongoose.connection.db.admin().ping(); res.json({ status: 'ready' }); } catch { res.status(503).json({ status: 'unavailable' }); } });
  app.use('/api/v1', rateLimit('api-ip', 600, 60), express.json({ limit: '128kb', strict: true }), routes);
  app.use((req, res, next) => next(new ApiError(404, 'NOT_FOUND', 'Route introuvable.')));
  app.use(errorHandler);
  return app;
}
