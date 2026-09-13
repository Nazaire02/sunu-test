import { z } from 'zod';
export const id = z.uuid();
export const phone = z.string().transform((value) => value.replace(/\s/g, '').replace(/^\+225/, '')).pipe(z.string().regex(/^(01|05|07)\d{8}$/, 'Numéro ivoirien invalide.'));
export const params = z.object({ id }).strict();
export const gender = z.enum(['Homme', 'Femme']);
export const method = z.enum(['Espèces', 'Mobile Money']);
export const pagination = z.object({ page: z.coerce.number().int().min(1).max(10000).default(1), limit: z.coerce.number().int().min(1).max(100).default(100) }).strict();
