import { ApiError } from '../utils/ApiError.js';
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error instanceof ApiError ? error.status : 500;
  let code = error instanceof ApiError ? error.code : 'INTERNAL_ERROR';
  let message = error instanceof ApiError ? error.message : 'Une erreur est survenue. Réessayez.';
  if (error.code === 11000) { status = 409; code = 'CONFLICT'; message = 'Cette ressource existe déjà.'; }
  if (error.type === 'entity.parse.failed') { status = 400; code = 'INVALID_JSON'; message = 'Le corps JSON est invalide.'; }
  if (error.type === 'entity.too.large' || error.code === 'LIMIT_FILE_SIZE') { status = 413; code = 'PAYLOAD_TOO_LARGE'; message = 'Le fichier ou la requête dépasse la taille autorisée.'; }
  if (error.name === 'MulterError') { status = status === 413 ? 413 : 400; code = 'INVALID_UPLOAD'; message = 'Envoyez une seule image de moins de 5 Mo.'; }
  if (status >= 500) req.log?.error({ err: error, requestId: req.id }, 'Request failed');
  res.status(status).json({ error: { code, message, ...(error instanceof ApiError && error.details ? { details: error.details } : {}), requestId: req.id } });
}
