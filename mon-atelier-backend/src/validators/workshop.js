import { z } from 'zod';
import { phone, id } from './common.js';
export const workshop = z.object({ name: z.string().trim().min(2).max(120), owner: z.string().trim().min(2).max(120), phone, city: z.string().trim().min(2).max(120), address: z.string().trim().max(300).default(''), logo: z.union([id, z.literal('')]).default('') }).strict();
