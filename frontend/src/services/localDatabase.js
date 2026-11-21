import { hasKey, readJSON, writeJSON } from '../utils/storage.js';
import { createMockData } from './mockData.js';

// Armazenamento temporário no navegador (localStorage). Será substituído pela API REST na FASE 5.
const KEYS = {
  tasks: 'taskflow:tasks',
  categories: 'taskflow:categories',
};

const SIMULATED_LATENCY_MS = 250;

function ensureSeeded() {
  if (hasKey(KEYS.tasks) && hasKey(KEYS.categories)) return;
  const { tasks, categories } = createMockData();
  writeJSON(KEYS.tasks, tasks);
  writeJSON(KEYS.categories, categories);
}

export function wait(ms = SIMULATED_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readCollection(name) {
  ensureSeeded();
  return readJSON(KEYS[name], []);
}

export function writeCollection(name, items) {
  writeJSON(KEYS[name], items);
}

export function generateId() {
  return crypto.randomUUID();
}
