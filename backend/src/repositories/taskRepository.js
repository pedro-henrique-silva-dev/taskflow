import { query } from '../config/database.js';

const PRIORITY_RANK = "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END";

// Tarefas concluídas sempre aparecem depois das pendentes.
const ORDER_BY = {
  dueDate: `due_date ASC NULLS LAST, ${PRIORITY_RANK}, created_at DESC`,
  priority: `${PRIORITY_RANK}, due_date ASC NULLS LAST, created_at DESC`,
  createdAt: 'created_at DESC',
  title: 'LOWER(title) ASC',
};

function escapeLike(text) {
  return text.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function listByUser(userId, { search, status, category, sort }) {
  const conditions = ['user_id = $1'];
  const params = [userId];
  const addParam = (value) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (search) {
    const term = addParam(`%${escapeLike(search)}%`);
    conditions.push(`(title ILIKE ${term} OR description ILIKE ${term})`);
  }

  if (status === 'overdue') {
    conditions.push("status = 'pending' AND due_date < CURRENT_DATE");
  } else if (status !== 'all') {
    conditions.push(`status = ${addParam(status)}`);
  }

  if (category === 'none') {
    conditions.push('category_id IS NULL');
  } else if (category !== 'all') {
    conditions.push(`category_id = ${addParam(category)}`);
  }

  const { rows } = await query(
    `SELECT * FROM tasks
     WHERE ${conditions.join(' AND ')}
     ORDER BY (status = 'completed'), ${ORDER_BY[sort] ?? ORDER_BY.dueDate}`,
    params,
  );
  return rows;
}

export async function findById(userId, id) {
  const { rows } = await query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return rows[0] ?? null;
}

export async function create(userId, { title, description, priority, categoryId, dueDate }) {
  const { rows } = await query(
    `INSERT INTO tasks (user_id, title, description, priority, category_id, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, description, priority, categoryId, dueDate],
  );
  return rows[0];
}

export async function update(userId, id, { title, description, priority, categoryId, dueDate }) {
  const { rows } = await query(
    `UPDATE tasks
     SET title = $3, description = $4, priority = $5, category_id = $6, due_date = $7
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, title, description, priority, categoryId, dueDate],
  );
  return rows[0] ?? null;
}

export async function updateStatus(userId, id, status) {
  const { rows } = await query(
    `UPDATE tasks
     SET status = $3::varchar,
         completed_at = CASE WHEN $3::varchar = 'completed' THEN NOW() ELSE NULL END
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, status],
  );
  return rows[0] ?? null;
}

export async function remove(userId, id) {
  const { rowCount } = await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
}
