import { uploadMedia, mediaUrl, readMedia } from '../services/mediaService.js';
export async function upload(req, res) { const id = await uploadMedia(req.auth.userId, req.file); res.status(201).json({ data: { id, url: await mediaUrl(id, req.auth) } }); }
export async function read(req, res) { const media = await readMedia(req.validated.params.id, req.validated.query.token); res.set({ 'Content-Type': media.mime, 'Cache-Control': 'private, no-store', 'Cross-Origin-Resource-Policy': 'cross-origin', 'X-Content-Type-Options': 'nosniff' }); res.send(media.data); }
