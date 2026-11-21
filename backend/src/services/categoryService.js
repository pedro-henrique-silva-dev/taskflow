import { toCategory } from '../models/categoryModel.js';
import * as categoryRepository from '../repositories/categoryRepository.js';
import { AppError } from '../utils/AppError.js';
import { isUniqueViolation } from '../utils/postgresErrors.js';

const NOT_FOUND = 'Categoria não encontrada.';
const DUPLICATED = 'Já existe uma categoria com esse nome.';

async function withUniqueName(operation) {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error)) throw AppError.conflict(DUPLICATED, { name: DUPLICATED });
    throw error;
  }
}

export async function list(userId) {
  const rows = await categoryRepository.listByUser(userId);
  return rows.map(toCategory);
}

export async function create(userId, data) {
  const row = await withUniqueName(() => categoryRepository.create(userId, data));
  return toCategory(row);
}

export async function update(userId, id, data) {
  const row = await withUniqueName(() => categoryRepository.update(userId, id, data));
  if (!row) throw AppError.notFound(NOT_FOUND);
  return toCategory(row);
}

export async function remove(userId, id) {
  const removed = await categoryRepository.remove(userId, id);
  if (!removed) throw AppError.notFound(NOT_FOUND);
}

export async function assertBelongsToUser(userId, categoryId) {
  if (!categoryId) return;
  const category = await categoryRepository.findById(userId, categoryId);
  if (!category) {
    throw AppError.badRequest('Dados inválidos.', { categoryId: NOT_FOUND });
  }
}
