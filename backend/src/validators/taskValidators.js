import { z } from 'zod';
import { emptyToNull } from './common.js';

export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUSES = ['pending', 'completed'];
export const STATUS_FILTERS = ['all', 'pending', 'completed', 'overdue'];
export const SORT_OPTIONS = ['dueDate', 'priority', 'createdAt', 'title'];

function isRealDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

const dueDate = z
  .string({ error: 'Informe uma data válida.' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Use o formato AAAA-MM-DD.' })
  .refine(isRealDate, { error: 'Informe uma data válida.' });

export const taskBodySchema = z.object({
  title: z
    .string({ error: 'Informe o título da tarefa.' })
    .trim()
    .min(3, { error: 'O título deve ter pelo menos 3 caracteres.' })
    .max(100, { error: 'O título deve ter no máximo 100 caracteres.' }),
  description: z
    .string({ error: 'Descrição inválida.' })
    .trim()
    .max(500, { error: 'A descrição deve ter no máximo 500 caracteres.' })
    .default(''),
  priority: z.enum(PRIORITIES, { error: 'Selecione uma prioridade válida.' }).default('medium'),
  categoryId: emptyToNull(z.uuid({ error: 'Categoria inválida.' }).nullable().default(null)),
  dueDate: emptyToNull(dueDate.nullable().default(null)),
});

export const taskStatusSchema = z.object({
  status: z.enum(STATUSES, { error: 'Status inválido. Use "pending" ou "completed".' }),
});

export const taskListQuerySchema = z.object({
  search: z.string().trim().max(100, { error: 'Pesquisa muito longa.' }).default(''),
  status: z.enum(STATUS_FILTERS, { error: 'Filtro de status inválido.' }).default('all'),
  category: z
    .union([z.literal('all'), z.literal('none'), z.uuid()], { error: 'Filtro de categoria inválido.' })
    .default('all'),
  sort: z.enum(SORT_OPTIONS, { error: 'Ordenação inválida.' }).default('dueDate'),
});
