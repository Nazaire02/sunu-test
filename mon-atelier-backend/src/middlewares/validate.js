import { ApiError } from '../utils/ApiError.js';
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) return next(new ApiError(422, 'VALIDATION_ERROR', 'Vérifiez les informations saisies.', parsed.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))));
    req.validated ??= {};
    req.validated[source] = parsed.data;
    next();
  };
}
