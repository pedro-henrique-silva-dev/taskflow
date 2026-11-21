import { CATEGORY_LIMITS, PRIORITY_LABELS, TASK_LIMITS } from './constants.js';
import { isValidISODate } from './date.js';

export function validateTask(values) {
  const errors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Informe o título da tarefa.';
  } else if (title.length < TASK_LIMITS.TITLE_MIN) {
    errors.title = `O título deve ter pelo menos ${TASK_LIMITS.TITLE_MIN} caracteres.`;
  } else if (title.length > TASK_LIMITS.TITLE_MAX) {
    errors.title = `O título deve ter no máximo ${TASK_LIMITS.TITLE_MAX} caracteres.`;
  }

  if (values.description.trim().length > TASK_LIMITS.DESCRIPTION_MAX) {
    errors.description = `A descrição deve ter no máximo ${TASK_LIMITS.DESCRIPTION_MAX} caracteres.`;
  }

  if (!PRIORITY_LABELS[values.priority]) {
    errors.priority = 'Selecione uma prioridade válida.';
  }

  if (values.dueDate && !isValidISODate(values.dueDate)) {
    errors.dueDate = 'Informe uma data válida.';
  }

  return errors;
}

export function validateCategory(values, categories, currentId = null) {
  const errors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Informe o nome da categoria.';
  } else if (name.length < CATEGORY_LIMITS.NAME_MIN) {
    errors.name = `O nome deve ter pelo menos ${CATEGORY_LIMITS.NAME_MIN} caracteres.`;
  } else if (name.length > CATEGORY_LIMITS.NAME_MAX) {
    errors.name = `O nome deve ter no máximo ${CATEGORY_LIMITS.NAME_MAX} caracteres.`;
  } else if (
    categories.some(
      (category) =>
        category.id !== currentId && category.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = 'Já existe uma categoria com esse nome.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
