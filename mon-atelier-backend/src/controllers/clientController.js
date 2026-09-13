import * as service from '../services/clientService.js';
import { clientDto } from '../services/serializeService.js';
export async function list(req, res) { const { items, ...meta } = await service.listClients(req.auth.userId, req.validated.query); res.json({ data: items.map(clientDto), meta }); }
export async function get(req, res) { res.json({ data: clientDto(await service.getClient(req.auth.userId, req.validated.params.id)) }); }
export async function create(req, res) { res.status(201).json({ data: clientDto(await service.createClient(req.auth.userId, req.validated.body)) }); }
export async function update(req, res) { res.json({ data: clientDto(await service.updateClient(req.auth.userId, req.validated.params.id, req.validated.body)) }); }
