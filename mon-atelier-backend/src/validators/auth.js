import { z } from 'zod';
import { id, phone } from './common.js';
export const requestCode = z.object({ phone }).strict();
export const verifyCode = z.object({ challengeId: id, code: z.string().regex(/^\d{6}$/) }).strict();
export const refresh = z.object({ refreshToken: z.string().min(80).max(150).optional() }).strict();
