export class ApiError extends Error {
  constructor(status, code, message, details) { super(message); this.status = status; this.code = code; this.details = details; }
}
export function notFound() { return new ApiError(404, 'NOT_FOUND', 'Ressource introuvable.'); }
