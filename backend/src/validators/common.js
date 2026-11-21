import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.uuid({ error: 'Identificador inválido.' }),
});

// Converte '' em null para campos opcionais vindos de formulários.
export function emptyToNull(schema) {
  return z.preprocess((value) => (value === '' ? null : value), schema);
}
