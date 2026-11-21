import { AppError } from '../utils/AppError.js';

// Valida req[source] com um schema Zod e guarda o resultado tratado em req.validated[source].
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || source;
        details[field] ??= issue.message;
      }
      throw AppError.badRequest('Dados inválidos.', details);
    }

    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}
