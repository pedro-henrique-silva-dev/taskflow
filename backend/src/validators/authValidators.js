import { z } from 'zod';

const email = z
  .string({ error: 'Informe o e-mail.' })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Informe um e-mail válido.' }).max(255, { error: 'E-mail muito longo.' }));

export const registerSchema = z.object({
  name: z
    .string({ error: 'Informe o nome.' })
    .trim()
    .min(2, { error: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(100, { error: 'O nome deve ter no máximo 100 caracteres.' }),
  email,
  password: z
    .string({ error: 'Informe a senha.' })
    .min(8, { error: 'A senha deve ter pelo menos 8 caracteres.' })
    .max(72, { error: 'A senha deve ter no máximo 72 caracteres.' })
    .regex(/[A-Za-z]/, { error: 'A senha deve conter pelo menos uma letra.' })
    .regex(/\d/, { error: 'A senha deve conter pelo menos um número.' }),
});

export const loginSchema = z.object({
  email,
  password: z.string({ error: 'Informe a senha.' }).min(1, { error: 'Informe a senha.' }),
});
