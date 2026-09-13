import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().default('0.0.0.0'),
  MONGODB_URI: z.string().regex(/^mongodb(?:\+srv)?:\/\//),
  JWT_SECRET: z.string().min(64),
  PUBLIC_URL: z.url().default('http://localhost:4000'),
  CORS_ORIGINS: z.string().default('http://localhost:8081,http://localhost:8082'),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  LOG_LEVEL: z.enum(['silent', 'error', 'warn', 'info', 'debug']).default('info'),
  TWILIO_ACCOUNT_SID: z.string().default(''),
  TWILIO_AUTH_TOKEN: z.string().default(''),
  TWILIO_WHATSAPP_FROM: z.union([z.string()]).default(''),
  TWILIO_WHATSAPP_CONTENT_SID: z.union([z.string()]).default(''),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) throw new Error(`Configuration invalide : ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
export const config = Object.freeze({ ...parsed.data, PUBLIC_URL: parsed.data.PUBLIC_URL.replace(/\/$/, ''), origins: parsed.data.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean), accessSeconds: 900, sessionSeconds: 7 * 24 * 60 * 60 });
if (config.NODE_ENV === 'production' && (!config.PUBLIC_URL.startsWith('https://') || !config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_WHATSAPP_FROM || !config.TWILIO_WHATSAPP_CONTENT_SID || !config.origins.length || config.origins.includes('*'))) throw new Error('En production, configurez HTTPS, les origines autorisées et Twilio WhatsApp.');
