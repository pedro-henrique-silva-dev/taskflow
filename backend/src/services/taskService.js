import { toTask } from '../models/taskModel.js';
import * as taskRepository from '../repositories/taskRepository.js';
import { AppError } from '../utils/AppError.js';
import { assertBelongsToUser } from './categoryService.js';

const NOT_FOUND = 'Tarefa não encontrada.';

function orNotFound(row) {
  if (!row) throw AppError.notFound(NOT_FOUND);
  return toTask(row);
}

export async function list(userId, filters) {
  const rows = await taskRepository.listByUser(userId, filters);
  return rows.map(toTask);
}

export async function getById(userId, id) {
  return orNotFound(await taskRepository.findById(userId, id));
}

export async function create(userId, data) {
  await assertBelongsToUser(userId, data.categoryId);
  return toTask(await taskRepository.create(userId, data));
}

export async function update(userId, id, data) {
  await assertBelongsToUser(userId, data.categoryId);
  return orNotFound(await taskRepository.update(userId, id, data));
}

export async function setStatus(userId, id, status) {
  return orNotFound(await taskRepository.updateStatus(userId, id, status));
}

export async function remove(userId, id) {
  const removed = await taskRepository.remove(userId, id);
  if (!removed) throw AppError.notFound(NOT_FOUND);
}
