import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/unit';
process.env.JWT_SECRET = 'u'.repeat(64);
const { order, draft } = await import('../src/validators/order.js');
const { garmentMeasurements } = await import('../src/config/measurements.js');
const { calculateFinish } = await import('../src/services/orderService.js');
const { signToken } = await import('../src/services/tokenService.js');
const { decodeJwt } = await import('jose');
const id = '12345678-1234-4234-8234-123456789012';
const garment = Object.keys(garmentMeasurements)[0];
const piece = { id, garment, measurements: Object.fromEntries(garmentMeasurements[garment].map(name => [name, '42,5'])) };
const input = { requestId: id, clientId: id, gender: 'Homme', pieces: [piece], total: 20000, deposit: 5000, method: 'Espèces', durationDays: 3 };
test('mesures adaptées au vêtement, champs étrangers et acompte excessif', () => {
  assert.equal(order.safeParse(input).success, true);
  assert.equal(order.safeParse({ ...input, deposit: 20001 }).success, false);
  assert.equal(order.safeParse({ ...input, ownerId: id }).success, false);
  assert.equal(order.safeParse({ ...input, pieces: [{ ...piece, measurements: {} }] }).success, false);
  assert.equal(draft.safeParse({ ...input, pieces: [{ ...piece, measurements: {} }], total: '', deposit: '', durationDays: '', description: '', photos: [] }).success, true);
});
test('finition après la file active sans départ dans le passé', () => {
  const now = new Date('2026-09-13T10:00:00Z');
  assert.equal(calculateFinish(null, 3, now).toISOString(), '2026-09-16T12:00:00.000Z');
  assert.equal(calculateFinish('2026-09-20T12:00:00Z', 3, now).toISOString(), '2026-09-23T12:00:00.000Z');
  assert.equal(calculateFinish('2026-09-01T12:00:00Z', 3, now).toISOString(), '2026-09-16T12:00:00.000Z');
});
test('access token limité à quinze minutes et à la fin absolue de session', async () => {
  const now = Math.floor(Date.now() / 1000);
  const session = { _id: id, expiresAt: new Date((now + 604800) * 1000) };
  const access = decodeJwt(await signToken(id, session, 'access'));
  assert.ok(access.exp <= now + 901);
  session.expiresAt = new Date((now + 30) * 1000);
  assert.equal(decodeJwt(await signToken(id, session, 'access')).exp, now + 30);
  assert.equal(decodeJwt(await signToken(id, session, 'media')).exp, now + 30);
});
