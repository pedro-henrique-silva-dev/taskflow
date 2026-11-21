import { z } from 'zod';

export const categoryBodySchema = z.object({
  name: z
    .string({ error: 'Informe o nome da categoria.' })
    .trim()
    .min(2, { error: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(30, { error: 'O nome deve ter no máximo 30 caracteres.' }),
  color: z
    .string({ error: 'Informe a cor.' })
    .regex(/^#[0-9a-fA-F]{6}$/, { error: 'Cor inválida. Use o formato #RRGGBB.' })
    .default('#4f46e5'),
});
