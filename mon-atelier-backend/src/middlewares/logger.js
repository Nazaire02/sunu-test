import pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { config } from '../config/index.js';
export const logger = pino({ level: config.LOG_LEVEL, base: undefined });
export const requestLogger = pinoHttp({ logger, genReqId: () => randomUUID(), serializers: { req: (req) => ({ id: req.id, method: req.method, path: req.url?.split('?')[0] }), res: (res) => ({ statusCode: res.statusCode }), err: (error) => ({ type: error.name, code: error.code }) } });
