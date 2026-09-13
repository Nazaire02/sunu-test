import * as service from '../services/workshopService.js';
import { workshopDto } from '../services/serializeService.js';
export async function get(req, res) { res.json({ data: await workshopDto(await service.getWorkshop(req.auth.userId), req.auth) }); }
export async function save(req, res) { res.json({ data: await workshopDto(await service.saveWorkshop(req.auth.userId, req.validated.body), req.auth) }); }
