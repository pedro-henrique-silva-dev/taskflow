import { query } from '../config/database.js';

export async function health(_req, res) {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
}
