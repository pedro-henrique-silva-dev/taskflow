import pg from 'pg';
import { env } from './env.js';

// Colunas DATE voltam como texto 'AAAA-MM-DD', evitando deslocamentos de fuso horário.
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);

export const pool = new pg.Pool({ ...env.db, max: 10 });

export function query(text, params) {
  return pool.query(text, params);
}
