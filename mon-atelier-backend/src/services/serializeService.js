import { mediaUrl } from './mediaService.js';
export function clientDto(client) { return { id: client._id, name: client.name, phone: client.phone, gender: client.gender, address: client.address, notes: client.notes, createdAt: client.createdAt.toISOString() }; }
export async function workshopDto(workshop, auth) { if (!workshop) return null; return { name: workshop.name, owner: workshop.owner, phone: workshop.phone, city: workshop.city, address: workshop.address, logo: await mediaUrl(workshop.logo, auth) }; }
export async function orderDto(order, auth) {
  const value = order.toObject({ flattenMaps: true });
  return { id: value._id, number: value.number, clientId: value.clientId, gender: value.gender, pieces: value.pieces, description: value.description, photos: await Promise.all(value.photos.map((id) => mediaUrl(id, auth))), total: value.total, payments: value.payments.map(({ id, amount, date, method }) => ({ id, amount, date: date.toISOString(), method })), durationDays: value.durationDays, dueDate: value.dueDate.toISOString(), createdAt: value.createdAt.toISOString(), status: value.status };
}
export async function draftDto(draft, auth) { if (!draft) return null; const value = draft.toObject({ flattenMaps: true }); return { clientId: value.clientId, gender: value.gender, pieces: value.pieces, description: value.description, photos: await Promise.all(value.photos.map((id) => mediaUrl(id, auth))), total: value.total, deposit: value.deposit, durationDays: value.durationDays, method: value.method, requestId: value.requestId }; }
