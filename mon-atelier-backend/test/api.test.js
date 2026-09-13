import { before, after, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import sharp from 'sharp';

let mongo;
let app;
let mongoose;
let Session;
let Challenge;
let RateLimit;
let verificationProvider;
let tokenService;
let owner;
let stranger;
let client;
let order;
const sentCodes = new Map();
const challengeIds = new Map();
const phoneA = '0700000001';
const phoneB = '0500000002';
const auth = (token) => ({ Authorization: `Bearer ${token}`, 'X-Client-Platform': 'native' });
async function login(phone, platform = 'native') {
  const challenge = await request(app).post('/api/v1/auth/request-code').send({ phone }).expect(200);
  challengeIds.set(phone, challenge.body.data.challengeId);
  return request(app).post('/api/v1/auth/verify-code').set('X-Client-Platform', platform).send({ challengeId: challenge.body.data.challengeId, code: sentCodes.get(phone) }).expect(200);
}
const workshop = (phone) => ({ name: 'Atelier Test', owner: 'Test Couture', phone, city: 'Abidjan', address: '', logo: '' });
const clientInput = { name: 'Client Test', phone: '0100000003', gender: 'Femme', address: '', notes: '' };
const makeOrder = () => ({ requestId: randomUUID(), clientId: client.id, gender: 'Femme', pieces: [{ id: 'piece-1', garment: 'Jupe', measurements: { 'Tour de taille': '75', 'Tour de bassin': '95', 'Longueur jupe': '60' } }], description: 'Jupe test', photos: [], total: 60000, deposit: 20000, durationDays: 7, method: 'Espèces' });

before(async () => {
  mongo = await MongoMemoryServer.create({ binary: process.env.MONGOMS_SYSTEM_BINARY ? { systemBinary: process.env.MONGOMS_SYSTEM_BINARY } : undefined });
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_SECRET = 'test-only-secret-with-at-least-sixty-four-characters-not-for-production';
  process.env.LOG_LEVEL = 'silent';
  process.env.PUBLIC_URL = 'http://localhost:4000';
  process.env.CORS_ORIGINS = 'http://localhost:8081';
  ({ verificationProvider } = await import('../src/services/verificationService.js'));
  mock.method(verificationProvider, 'send', async (phone, code) => { sentCodes.set(phone, code); });
  const { connectDatabase } = await import('../src/config/db.js');
  const { createApp } = await import('../src/app.js');
  mongoose = (await import('mongoose')).default;
  Session = (await import('../src/models/Session.js')).default;
  Challenge = (await import('../src/models/Challenge.js')).default;
  RateLimit = (await import('../src/models/RateLimit.js')).default;
  tokenService = await import('../src/services/tokenService.js');
  await connectDatabase();
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
  app = createApp();
  owner = (await login(phoneA)).body.data;
  stranger = (await login(phoneB)).body.data;
}, { timeout: 180000 });

after(async () => { mock.restoreAll(); if (mongoose) await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('health, authentification et refus des origines inconnues', async () => {
  await request(app).get('/health/ready').expect(200);
  await request(app).get('/api/v1/clients').expect(401);
  await request(app).get('/health/live').set('Origin', 'https://hostile.example').expect(403);
  assert.equal(owner.refreshToken.length > 80, true);
  assert.equal(Math.abs(new Date(owner.sessionExpiresAt).getTime() - Date.now() - 604800000) < 30000, true);
});

test('le code est à usage unique et cinq erreurs bloquent le challenge', async () => {
  assert.equal(await Challenge.findOne({ phone: phoneA }), null);
  await request(app).post('/api/v1/auth/verify-code').send({ challengeId: challengeIds.get(phoneA), code: sentCodes.get(phoneA) }).expect(401);
  const challenge = await request(app).post('/api/v1/auth/request-code').send({ phone: '0700000004' }).expect(200);
  const incorrectCode = sentCodes.get('0700000004') === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) await request(app).post('/api/v1/auth/verify-code').send({ challengeId: challenge.body.data.challengeId, code: incorrectCode }).expect(401);
  await request(app).post('/api/v1/auth/verify-code').send({ challengeId: challenge.body.data.challengeId, code: sentCodes.get('0700000004') }).expect(401);
});

test('création atelier et client, validation et isolation', async () => {
  await request(app).put('/api/v1/workshop').set(auth(owner.accessToken)).send(workshop(phoneB)).expect(422);
  await request(app).put('/api/v1/workshop').set(auth(owner.accessToken)).send(workshop(phoneA)).expect(200);
  await request(app).put('/api/v1/workshop').set(auth(stranger.accessToken)).send(workshop(phoneB)).expect(200);
  client = (await request(app).post('/api/v1/clients').set(auth(owner.accessToken)).send(clientInput).expect(201)).body.data;
  await request(app).get(`/api/v1/clients/${client.id}`).set(auth(stranger.accessToken)).expect(404);
  await request(app).patch(`/api/v1/clients/${client.id}`).set(auth(stranger.accessToken)).send(clientInput).expect(404);
  await request(app).post('/api/v1/clients').set(auth(owner.accessToken)).send(clientInput).expect(409);
  await request(app).post('/api/v1/clients').set(auth(owner.accessToken)).send({ ...clientInput, ownerId: stranger.user.id }).expect(422);
  assert.equal((await request(app).get('/api/v1/clients').set(auth(stranger.accessToken)).expect(200)).body.data.length, 0);
});

test('commande compatible mobile, idempotence et calcul serveur', async () => {
  const input = makeOrder();
  await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send({ ...input, deposit: 70000 }).expect(422);
  await request(app).post('/api/v1/orders').set(auth(stranger.accessToken)).send(input).expect(404);
  order = (await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(input).expect(201)).body.data;
  const retry = (await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(input).expect(201)).body.data;
  assert.equal(retry.id, order.id);
  assert.equal(order.number, 'CMD-0001');
  assert.equal(order.payments[0].amount, 20000);
  assert.deepEqual(order.pieces[0].measurements, input.pieces[0].measurements);
  await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send({ ...input, total: 65000 }).expect(409);
  await request(app).get(`/api/v1/orders/${order.id}`).set(auth(stranger.accessToken)).expect(404);
});

test('commandes simultanées : références et échéances distinctes', async () => {
  const responses = await Promise.all([makeOrder(), makeOrder()].map((input) => request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(input)));
  assert.deepEqual(responses.map((response) => response.status), [201, 201]);
  const records = responses.map((response) => response.body.data).sort((a, b) => a.number.localeCompare(b.number));
  assert.deepEqual(records.map((record) => record.number), ['CMD-0002', 'CMD-0003']);
  assert.equal(new Date(records[1].dueDate) - new Date(records[0].dueDate), 7 * 86400000);
});

test('paiements concurrents, double envoi et transitions', async () => {
  await request(app).patch(`/api/v1/orders/${order.id}/status`).set(auth(owner.accessToken)).send({ status: 'Livrée' }).expect(409);
  const payment = { requestId: randomUUID(), amount: 30000, method: 'Mobile Money' };
  const responses = await Promise.all([payment, { ...payment, requestId: randomUUID() }].map((input) => request(app).post(`/api/v1/orders/${order.id}/payments`).set(auth(owner.accessToken)).send(input)));
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 422]);
  const successfulIndex = responses.findIndex((response) => response.status === 200);
  const succeeded = responses[successfulIndex].body.data;
  assert.equal(succeeded.payments.reduce((sum, item) => sum + item.amount, 0), 50000);
  if (successfulIndex === 0) await request(app).post(`/api/v1/orders/${order.id}/payments`).set(auth(owner.accessToken)).send(payment).expect(200);
  await request(app).post(`/api/v1/orders/${order.id}/payments`).set(auth(stranger.accessToken)).send({ ...payment, requestId: randomUUID() }).expect(404);
  await request(app).patch(`/api/v1/orders/${order.id}/status`).set(auth(owner.accessToken)).send({ status: 'Prête' }).expect(200);
  await request(app).patch(`/api/v1/orders/${order.id}/status`).set(auth(owner.accessToken)).send({ status: 'Livrée' }).expect(200);
  await request(app).patch(`/api/v1/orders/${order.id}/status`).set(auth(owner.accessToken)).send({ status: 'Prête' }).expect(409);
});

test('doubles envois simultanés de commandes et paiements sans replica set', async () => {
  const input = makeOrder();
  const created = await Promise.all([input, input].map((body) => request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(body)));
  assert.deepEqual(created.map((response) => response.status), [201, 201]);
  assert.equal(created[0].body.data.id, created[1].body.data.id);
  const id = created[0].body.data.id;
  const payment = { requestId: randomUUID(), amount: 10000, method: 'Espèces' };
  const paid = await Promise.all([payment, payment].map((body) => request(app).post(`/api/v1/orders/${id}/payments`).set(auth(owner.accessToken)).send(body)));
  assert.deepEqual(paid.map((response) => response.status), [200, 200]);
  const saved = (await request(app).get(`/api/v1/orders/${id}`).set(auth(owner.accessToken)).expect(200)).body.data;
  assert.equal(saved.payments.reduce((sum, payment) => sum + payment.amount, 0), 30000);
  const Order = (await import('../src/models/Order.js')).default;
  assert.equal((await Order.findOne({ _id: id, ownerId: owner.user.id })).paidAmount, 30000);
  assert.equal(saved.payments.length, 2);
  await request(app).post(`/api/v1/orders/${id}/payments`).set(auth(owner.accessToken)).send({ ...payment, amount: 5000 }).expect(409);
});

test('une création échouée ne bloque pas les suivantes et le nettoyage peut être repris', async () => {
  const Draft = (await import('../src/models/Draft.js')).default;
  const Order = (await import('../src/models/Order.js')).default;
  const input = makeOrder();
  await Draft.create({ ownerId: owner.user.id, requestId: input.requestId });
  const deletion = mock.method(Draft, 'deleteOne', () => { throw new Error('Draft cleanup failed'); });
  try {
    await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(input).expect(500);
  } finally { deletion.mock.restore(); }
  const retry = (await request(app).post('/api/v1/orders').set(auth(owner.accessToken)).send(input).expect(201)).body.data;
  assert.equal(await Order.countDocuments({ ownerId: owner.user.id, requestId: input.requestId }), 1);
  assert.equal(await Draft.countDocuments({ ownerId: owner.user.id }), 0);
  assert.equal((await Order.findOne({ ownerId: owner.user.id, requestId: input.requestId })).id, retry.id);
});

test('photos privées et refus de référencer celles d’un autre atelier', async () => {
  const image = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#075637' } }).png().toBuffer();
  const media = (await request(app).post('/api/v1/media').set(auth(owner.accessToken)).attach('image', image, { filename: 'tissu.png', contentType: 'image/png' }).expect(201)).body.data;
  const url = new URL(media.url);
  await request(app).get(url.pathname + url.search).expect(200).expect('Content-Type', /image\/webp/);
  await request(app).get(url.pathname).expect(422);
  await request(app).post('/api/v1/orders').set(auth(stranger.accessToken)).send({ ...makeOrder(), clientId: (await request(app).post('/api/v1/clients').set(auth(stranger.accessToken)).send(clientInput).expect(201)).body.data.id, photos: [media.id] }).expect(422);
  await request(app).post('/api/v1/media').set(auth(owner.accessToken)).attach('image', Buffer.from('<svg/>'), { filename: 'bad.png', contentType: 'image/png' }).expect(415);
});

test('rotation sans prolongation, rejeu révoqué et expiration absolue', async () => {
  const refreshed = (await request(app).post('/api/v1/auth/refresh').send({ refreshToken: stranger.refreshToken }).expect(200)).body.data;
  assert.notEqual(refreshed.refreshToken, stranger.refreshToken);
  assert.equal(refreshed.sessionExpiresAt, stranger.sessionExpiresAt);
  await request(app).post('/api/v1/auth/refresh').send({ refreshToken: stranger.refreshToken }).expect(401);
  await request(app).get('/api/v1/clients').set(auth(refreshed.accessToken)).expect(401);
  await Session.updateOne({ _id: owner.refreshToken.split('.')[0] }, { expiresAt: new Date(Date.now() - 1000) });
  await request(app).post('/api/v1/auth/refresh').send({ refreshToken: owner.refreshToken }).expect(401);
  await request(app).get('/api/v1/clients').set(auth(owner.accessToken)).expect(401);
});

test('cookie web HttpOnly, CSRF et déconnexion serveur', async () => {
  await RateLimit.deleteMany({});
  const response = await login('0700000005', 'web');
  const cookie = response.headers['set-cookie'][0];
  assert.match(cookie, /HttpOnly/);
  assert.equal(response.body.data.refreshToken, undefined);
  await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie).set('X-Client-Platform', 'web').send({}).expect(403);
  const refresh = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie).set('Origin', 'http://localhost:8081').set('X-Client-Platform', 'web').send({}).expect(200);
  const freshCookie = refresh.headers['set-cookie'][0];
  await request(app).post('/api/v1/auth/logout').set('Cookie', freshCookie).set('Origin', 'http://localhost:8081').send({}).expect(204);
  await request(app).get('/api/v1/clients').set(auth(refresh.body.data.accessToken)).expect(401);
});

test('OTP : délai strict, remplacement et expiration sans attendre le TTL', async () => {
  await RateLimit.deleteMany({});
  const phone = '0700000006';
  const first = await request(app).post('/api/v1/auth/request-code').send({ phone }).expect(200);
  const oldCode = sentCodes.get(phone);
  assert.match(oldCode, /^\d{6}$/);
  assert.ok(Math.abs(new Date(first.body.data.expiresAt).getTime() - Date.now() - 600000) < 5000);
  const stored = await Challenge.findById(first.body.data.challengeId).select('+codeHash');
  assert.notEqual(stored.codeHash, oldCode);
  await request(app).post('/api/v1/auth/request-code').send({ phone }).expect(429);
  await RateLimit.deleteMany({});
  const second = await request(app).post('/api/v1/auth/request-code').send({ phone }).expect(200);
  assert.equal(await Challenge.findById(first.body.data.challengeId), null);
  await request(app).post('/api/v1/auth/verify-code').send({ challengeId: first.body.data.challengeId, code: oldCode }).expect(401);
  await Challenge.updateOne({ _id: second.body.data.challengeId }, { expiresAt: new Date(Date.now() - 1) });
  await request(app).post('/api/v1/auth/verify-code').send({ challengeId: second.body.data.challengeId, code: sentCodes.get(phone) }).expect(401);
});
