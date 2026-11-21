import { generateId, readCollection, wait, writeCollection } from './localDatabase.js';

function assertUniqueName(categories, name, currentId = null) {
  const exists = categories.some(
    (category) =>
      category.id !== currentId && category.name.toLowerCase() === name.toLowerCase(),
  );
  if (exists) throw new Error('Já existe uma categoria com esse nome.');
}

export async function listCategories() {
  await wait();
  return readCollection('categories');
}

export async function createCategory({ name, color }) {
  await wait();
  const categories = readCollection('categories');
  const trimmedName = name.trim();
  assertUniqueName(categories, trimmedName);
  const category = {
    id: generateId(),
    name: trimmedName,
    color,
    createdAt: new Date().toISOString(),
  };
  writeCollection('categories', [...categories, category]);
  return category;
}

export async function updateCategory(id, { name, color }) {
  await wait();
  const categories = readCollection('categories');
  const index = categories.findIndex((category) => category.id === id);
  if (index === -1) throw new Error('Categoria não encontrada.');
  const trimmedName = name.trim();
  assertUniqueName(categories, trimmedName, id);
  const updated = { ...categories[index], name: trimmedName, color };
  categories[index] = updated;
  writeCollection('categories', categories);
  return updated;
}

// Ao excluir uma categoria, as tarefas vinculadas ficam sem categoria (equivalente a ON DELETE SET NULL).
export async function deleteCategory(id) {
  await wait();
  const categories = readCollection('categories');
  if (!categories.some((category) => category.id === id)) {
    throw new Error('Categoria não encontrada.');
  }
  writeCollection(
    'categories',
    categories.filter((category) => category.id !== id),
  );
  writeCollection(
    'tasks',
    readCollection('tasks').map((task) =>
      task.categoryId === id ? { ...task, categoryId: null } : task,
    ),
  );
}
