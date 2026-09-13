import { randomUUID } from 'node:crypto';
import Order from '../models/Order.js';
import Workshop from '../models/Workshop.js';
import Client from '../models/Client.js';
import Draft from '../models/Draft.js';
import { ApiError, notFound } from '../utils/ApiError.js';
import { hash } from '../utils/crypto.js';
import { verifyOwnership } from './mediaService.js';

export function calculateFinish(lastDue, days, now = new Date()) {
  const start = new Date(now); start.setUTCHours(12, 0, 0, 0);
  const finish = new Date(Math.max(start.getTime(), lastDue ? new Date(lastDue).getTime() : 0));
  finish.setUTCDate(finish.getUTCDate() + days);
  return finish;
}
async function estimate(ownerId, days) {
  const last = await Order.findOne({ ownerId, status: 'En cours' }).sort({ dueDate: -1 });
  return calculateFinish(last?.dueDate, days);
}
export async function estimateOrder(ownerId, days) { return { dueDate: (await estimate(ownerId, days)).toISOString(), durationDays: days }; }
export async function listOrders(ownerId, { page, limit, status, clientId }) { const filter = { ownerId, ...(status ? { status } : {}), ...(clientId ? { clientId } : {}) }; const [items, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit), Order.countDocuments(filter)]); return { items, total, page, limit }; }
export async function getOrder(ownerId, id) { const order = await Order.findOne({ _id: id, ownerId }); if (!order) throw notFound(); return order; }
const pendingOrders = new Map();
export async function createOrder(ownerId, input) {
  const previous = pendingOrders.get(ownerId) ?? Promise.resolve();
  const operation = previous.catch(() => {}).then(() => persistOrder(ownerId, input));
  pendingOrders.set(ownerId, operation);
  try { return await operation; }
  finally { if (pendingOrders.get(ownerId) === operation) pendingOrders.delete(ownerId); }
}
async function persistOrder(ownerId, input) {
  const requestHash = hash(JSON.stringify(input));
  const existing = await Order.findOne({ ownerId, requestId: input.requestId });
  if (existing) {
    if (existing.requestHash !== requestHash) throw new ApiError(409, 'IDEMPOTENCY_CONFLICT', 'Cette demande a déjà été enregistrée avec un autre contenu.');
    await Draft.deleteOne({ ownerId, requestId: input.requestId });
    return existing;
  }
  const client = await Client.findOne({ _id: input.clientId, ownerId });
  if (!client) throw notFound();
  await verifyOwnership(ownerId, input.photos);
  const dueDate = await estimate(ownerId, input.durationDays);
  const workshop = await Workshop.findOneAndUpdate({ ownerId }, { $inc: { sequence: 1 } }, { returnDocument: 'after' });
  if (!workshop) throw new ApiError(409, 'WORKSHOP_REQUIRED', 'Créez votre atelier pour continuer.');
  const { deposit, method, ...fields } = input;
  let order;
  try {
    order = await Order.create({ ...fields, ownerId, requestHash, dueDate, number: `CMD-${String(workshop.sequence).padStart(4, '0')}`, paidAmount: deposit, payments: deposit > 0 ? [{ id: randomUUID(), requestId: input.requestId, requestHash, amount: deposit, date: new Date(), method }] : [] });
  } catch (error) {
    if (error.code !== 11000) throw error;
    order = await Order.findOne({ ownerId, requestId: input.requestId });
    if (!order) throw error;
    if (order.requestHash !== requestHash) throw new ApiError(409, 'IDEMPOTENCY_CONFLICT', 'Cette demande a déjà été enregistrée avec un autre contenu.');
  }
  await Draft.deleteOne({ ownerId, requestId: input.requestId });
  return order;
}
export async function addPayment(ownerId, id, input) {
  const requestHash = hash(JSON.stringify(input));
  const updated = await Order.findOneAndUpdate({
    _id: id,
    ownerId,
    'payments.requestId': { $ne: input.requestId },
    $expr: { $lte: [{ $add: ['$paidAmount', input.amount] }, '$total'] },
  }, {
    $inc: { paidAmount: input.amount },
    $push: { payments: { id: randomUUID(), ...input, requestHash, date: new Date() } },
  }, { returnDocument: 'after', runValidators: true });
  if (updated) return updated;
  const order = await getOrder(ownerId, id);
  const existing = order.payments.find((payment) => payment.requestId === input.requestId);
  if (existing) {
    if (existing.requestHash !== requestHash) throw new ApiError(409, 'IDEMPOTENCY_CONFLICT', 'Ce paiement a déjà été enregistré avec un autre montant.');
    return order;
  }
  throw new ApiError(422, 'PAYMENT_EXCEEDS_BALANCE', 'Le paiement dépasse le solde restant.');
}
export async function changeStatus(ownerId, id, status) {
  const expected = status === 'Prête' ? 'En cours' : 'Prête';
  const order = await Order.findOneAndUpdate({ _id: id, ownerId, status: expected }, { $set: { status } }, { returnDocument: 'after', runValidators: true });
  if (order) return order;
  const existing = await getOrder(ownerId, id);
  if (existing.status === status) return existing;
  throw new ApiError(409, 'INVALID_STATUS_TRANSITION', 'Une commande doit être prête avant sa livraison.');
}
export function getDraft(ownerId) { return Draft.findOne({ ownerId }); }
export async function saveDraft(ownerId, input) {
  await verifyOwnership(ownerId, input.photos);
  if (input.clientId && !await Client.exists({ _id: input.clientId, ownerId })) throw notFound();
  return Draft.findOneAndUpdate({ ownerId }, { $set: input, $setOnInsert: { ownerId } }, { upsert: true, returnDocument: 'after', runValidators: true });
}
export function deleteDraft(ownerId) { return Draft.deleteOne({ ownerId }); }
