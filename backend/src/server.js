import { app } from './app.js';
import { pool } from './config/database.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`API do TaskFlow rodando em http://localhost:${env.port}/api`);
});

function shutdown(signal) {
  console.log(`${signal} recebido. Encerrando o servidor...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
