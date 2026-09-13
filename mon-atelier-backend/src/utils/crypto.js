import { createHash, randomBytes } from 'node:crypto';
export function hash(value) { return createHash('sha256').update(value).digest('hex'); }
export function secret() { return randomBytes(48).toString('base64url'); }
