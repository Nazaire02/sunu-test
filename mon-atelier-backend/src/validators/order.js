import { z } from 'zod';
import { id, gender, method, pagination } from './common.js';
import { garmentMeasurements, garments } from '../config/measurements.js';
const measurementNames = [...new Set(Object.values(garmentMeasurements).flat())];
const partialPiece = z.object({ id: z.string().min(1).max(80), garment: z.enum(garments), measurements: z.partialRecord(z.enum(measurementNames), z.string().max(16)) }).strict();
const piece = partialPiece.superRefine((value, context) => {
  const names = garmentMeasurements[value.garment];
  for (const name of names) {
    const raw = value.measurements[name]?.replace(',', '.');
    if (!raw || !/^\d+(\.\d+)?$/.test(raw) || Number(raw) <= 0 || Number(raw) > 500) context.addIssue({ code: 'custom', path: ['measurements', name], message: 'Mesure requise entre 0 et 500 cm.' });
  }
  if (Object.keys(value.measurements).some((name) => !names.includes(name))) context.addIssue({ code: 'custom', path: ['measurements'], message: 'Mesure non adaptée à ce vêtement.' });
});
const pieces = z.array(piece).min(1).max(30).refine((items) => new Set(items.map((item) => item.id)).size === items.length, 'Les pièces doivent avoir des identifiants distincts.');
const currency = z.number().int().min(0).max(1000000000);
export const order = z.object({ requestId: id, clientId: id, gender, pieces, description: z.string().trim().max(500).default(''), photos: z.array(id).max(6).default([]), total: currency.positive(), deposit: currency.default(0), method, durationDays: z.number().int().min(1).max(365) }).strict().refine((value) => value.deposit <= value.total, { path: ['deposit'], message: 'L’acompte ne peut pas dépasser le total.' });
export const payment = z.object({ requestId: id, amount: currency.positive(), method }).strict();
export const status = z.object({ status: z.enum(['Prête', 'Livrée']) }).strict();
export const estimate = z.object({ durationDays: z.coerce.number().int().min(1).max(365) }).strict();
export const orderQuery = pagination.extend({ status: z.enum(['En cours', 'Prête', 'Livrée']).optional(), clientId: id.optional() }).strict();
export const draft = z.object({ requestId: id, clientId: z.union([id, z.literal('')]), gender, pieces: z.array(partialPiece).max(30), description: z.string().max(500), photos: z.array(id).max(6), total: z.string().max(20), deposit: z.string().max(20), durationDays: z.string().max(4), method }).strict();
