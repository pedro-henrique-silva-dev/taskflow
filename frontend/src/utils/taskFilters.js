import { PRIORITY_WEIGHT, TASK_STATUS } from './constants.js';

export function isTaskOverdue(task, todayISO) {
  return task.status === TASK_STATUS.PENDING && Boolean(task.dueDate) && task.dueDate < todayISO;
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesSearch(task, search) {
  if (!search) return true;
  const term = normalize(search.trim());
  return normalize(`${task.title} ${task.description}`).includes(term);
}

function matchesStatus(task, status, todayISO) {
  if (status === 'overdue') return isTaskOverdue(task, todayISO);
  if (status === 'all') return true;
  return task.status === status;
}

function matchesCategory(task, category) {
  if (category === 'all') return true;
  if (category === 'none') return task.categoryId === null;
  return task.categoryId === category;
}

export function filterTasks(tasks, { search, status, category }, todayISO) {
  return tasks.filter(
    (task) =>
      matchesSearch(task, search) &&
      matchesStatus(task, status, todayISO) &&
      matchesCategory(task, category),
  );
}

function compareDueDate(a, b) {
  if (a.dueDate === b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate < b.dueDate ? -1 : 1;
}

function comparePriority(a, b) {
  return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
}

const comparators = {
  dueDate: (a, b) => compareDueDate(a, b) || comparePriority(a, b),
  priority: (a, b) => comparePriority(a, b) || compareDueDate(a, b),
  createdAt: (a, b) => b.createdAt.localeCompare(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
};

export function sortTasks(tasks, sortBy) {
  const compare = comparators[sortBy] ?? comparators.dueDate;
  const byStatus = (a, b) =>
    Number(a.status === TASK_STATUS.COMPLETED) - Number(b.status === TASK_STATUS.COMPLETED);
  return [...tasks].sort((a, b) => byStatus(a, b) || compare(a, b));
}
