import Client from '../models/Client.js';
import { notFound } from '../utils/ApiError.js';
import { requireWorkshop } from './workshopService.js';
export async function listClients(ownerId, { page, limit }) { const filter = { ownerId }; const [items, total] = await Promise.all([Client.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit), Client.countDocuments(filter)]); return { items, total, page, limit }; }
export async function getClient(ownerId, id) { const client = await Client.findOne({ _id: id, ownerId }); if (!client) throw notFound(); return client; }
export async function createClient(ownerId, input) { await requireWorkshop(ownerId); return Client.create({ ...input, ownerId }); }
export async function updateClient(ownerId, id, input) { const client = await Client.findOneAndUpdate({ _id: id, ownerId }, { $set: input }, { returnDocument: 'after', runValidators: true }); if (!client) throw notFound(); return client; }
