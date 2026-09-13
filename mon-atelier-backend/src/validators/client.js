import { z } from 'zod';
import { phone, gender } from './common.js';
export const client = z.object({ name: z.string().trim().min(2).max(120), phone, gender, address: z.string().trim().max(300).default(''), notes: z.string().trim().max(2000).default('') }).strict();
