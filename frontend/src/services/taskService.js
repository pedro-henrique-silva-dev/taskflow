import { TASK_STATUS } from '../utils/constants.js';
import { generateId, readCollection, wait, writeCollection } from './localDatabase.js';

function toTaskData(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    priority: values.priority,
    categoryId: values.categoryId || null,
    dueDate: values.dueDate || null,
  };
}

function findIndexOrFail(tasks, id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) throw new Error('Tarefa não encontrada.');
  return index;
}

export async function listTasks() {
  await wait();
  return readCollection('tasks');
}

export async function createTask(values) {
  await wait();
  const now = new Date().toISOString();
  const task = {
    id: generateId(),
    ...toTaskData(values),
    status: TASK_STATUS.PENDING,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('tasks', [...readCollection('tasks'), task]);
  return task;
}

export async function updateTask(id, values) {
  await wait();
  const tasks = readCollection('tasks');
  const index = findIndexOrFail(tasks, id);
  const updated = { ...tasks[index], ...toTaskData(values), updatedAt: new Date().toISOString() };
  tasks[index] = updated;
  writeCollection('tasks', tasks);
  return updated;
}

export async function setTaskStatus(id, status) {
  await wait();
  const tasks = readCollection('tasks');
  const index = findIndexOrFail(tasks, id);
  const now = new Date().toISOString();
  const updated = {
    ...tasks[index],
    status,
    completedAt: status === TASK_STATUS.COMPLETED ? now : null,
    updatedAt: now,
  };
  tasks[index] = updated;
  writeCollection('tasks', tasks);
  return updated;
}

export async function deleteTask(id) {
  await wait();
  const tasks = readCollection('tasks');
  findIndexOrFail(tasks, id);
  writeCollection(
    'tasks',
    tasks.filter((task) => task.id !== id),
  );
}
