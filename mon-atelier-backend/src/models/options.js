import { randomUUID } from 'node:crypto';
export const identifier = { type: String, default: randomUUID };
export const options = { timestamps: true, strict: 'throw', versionKey: false };
