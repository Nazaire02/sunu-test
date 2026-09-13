import * as service from '../services/orderService.js';
import { orderDto, draftDto } from '../services/serializeService.js';
export async function list(req, res) { const { items, ...meta } = await service.listOrders(req.auth.userId, req.validated.query); res.json({ data: await Promise.all(items.map((item) => orderDto(item, req.auth))), meta }); }
export async function get(req, res) { res.json({ data: await orderDto(await service.getOrder(req.auth.userId, req.validated.params.id), req.auth) }); }
export async function create(req, res) { res.status(201).json({ data: await orderDto(await service.createOrder(req.auth.userId, req.validated.body), req.auth) }); }
export async function payment(req, res) { res.json({ data: await orderDto(await service.addPayment(req.auth.userId, req.validated.params.id, req.validated.body), req.auth) }); }
export async function status(req, res) { res.json({ data: await orderDto(await service.changeStatus(req.auth.userId, req.validated.params.id, req.validated.body.status), req.auth) }); }
export async function estimate(req, res) { res.json({ data: await service.estimateOrder(req.auth.userId, req.validated.query.durationDays) }); }
export async function getDraft(req, res) { res.json({ data: await draftDto(await service.getDraft(req.auth.userId), req.auth) }); }
export async function saveDraft(req, res) { res.json({ data: await draftDto(await service.saveDraft(req.auth.userId, req.validated.body), req.auth) }); }
export async function deleteDraft(req, res) { await service.deleteDraft(req.auth.userId); res.status(204).end(); }
