import { query } from '../config/database.js';

export async function listByUser(userId) {
  const { rows } = await query(
    'SELECT * FROM categories WHERE user_id = $1 ORDER BY LOWER(name)',
    [userId],
  );
  return rows;
}

export async function findById(userId, id) {
  const { rows } = await query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return rows[0] ?? null;
}

export async function create(userId, { name, color }) {
  const { rows } = await query(
    `INSERT INTO categories (user_id, name, color)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, color],
  );
  return rows[0];
}

export async function update(userId, id, { name, color }) {
  const { rows } = await query(
    `UPDATE categories SET name = $3, color = $4
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, name, color],
  );
  return rows[0] ?? null;
}

// As tarefas da categoria ficam com category_id = NULL (ON DELETE SET NULL).
export async function remove(userId, id) {
  const { rowCount } = await query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return rowCount > 0;
}
