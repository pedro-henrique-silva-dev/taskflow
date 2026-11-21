// Testes de integração da API. Usam um banco PostgreSQL real e APAGAM os dados dele,
// por isso só rodam quando DB_NAME termina com "_test".
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { env } = await import('../src/config/env.js');
if (!env.db.database.endsWith('_test')) {
  throw new Error('Os testes apagam dados: use um banco cujo nome termine com "_test".');
}
const { app } = await import('../src/app.js');
const { pool } = await import('../src/config/database.js');

const api = request(app);
const PASSWORD = 'senhaSegura123';

async function registerUser(name, email) {
  const res = await api.post('/api/auth/register').send({ name, email, password: PASSWORD });
  assert.equal(res.status, 201);
  return { token: res.body.token, user: res.body.user, auth: { Authorization: `Bearer ${res.body.token}` } };
}

function isoDaysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

before(async () => {
  await pool.query('TRUNCATE users CASCADE');
});

after(async () => {
  await pool.end();
});

describe('Infraestrutura', () => {
  test('GET /api/health confirma API e banco', async () => {
    const res = await api.get('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok', database: 'ok' });
  });

  test('rota inexistente retorna 404 em JSON', async () => {
    const res = await api.get('/api/nao-existe');
    assert.equal(res.status, 404);
    assert.match(res.body.error.message, /Rota não encontrada/);
  });

  test('JSON malformado retorna 400', async () => {
    const res = await api
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');
    assert.equal(res.status, 400);
    assert.equal(res.body.error.message, 'JSON inválido no corpo da requisição.');
  });
});

describe('Autenticação', () => {
  test('cadastro cria usuário, devolve token e guarda senha criptografada', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ name: 'Ana Souza', email: 'ANA@Email.com', password: PASSWORD });

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'ana@email.com');
    assert.equal(res.body.user.password_hash, undefined);

    const { rows } = await pool.query('SELECT password_hash FROM users WHERE email = $1', [
      'ana@email.com',
    ]);
    assert.match(rows[0].password_hash, /^\$2[aby]\$10\$/);
    assert.notEqual(rows[0].password_hash, PASSWORD);
  });

  test('cadastro com e-mail repetido retorna 409', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ name: 'Outra Ana', email: 'ana@email.com', password: PASSWORD });
    assert.equal(res.status, 409);
    assert.equal(res.body.error.details.email, 'Este e-mail já está cadastrado.');
  });

  test('cadastro inválido retorna 400 com erros por campo', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ name: 'A', email: 'invalido', password: 'curta' });
    assert.equal(res.status, 400);
    assert.deepEqual(Object.keys(res.body.error.details).sort(), ['email', 'name', 'password']);
  });

  test('login com senha errada retorna 401 genérico', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'ana@email.com', password: 'senhaErrada1' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error.message, 'E-mail ou senha inválidos.');
  });

  test('login com e-mail inexistente retorna a mesma mensagem', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'ninguem@email.com', password: PASSWORD });
    assert.equal(res.status, 401);
    assert.equal(res.body.error.message, 'E-mail ou senha inválidos.');
  });

  test('login correto devolve token que acessa /me', async () => {
    const login = await api.post('/api/auth/login').send({ email: 'ana@email.com', password: PASSWORD });
    assert.equal(login.status, 200);

    const me = await api.get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    assert.equal(me.status, 200);
    assert.equal(me.body.user.name, 'Ana Souza');
  });

  test('rotas privadas recusam requisição sem token ou com token inválido', async () => {
    const semToken = await api.get('/api/tasks');
    assert.equal(semToken.status, 401);

    const tokenInvalido = await api.get('/api/tasks').set('Authorization', 'Bearer abc.def.ghi');
    assert.equal(tokenInvalido.status, 401);
    assert.equal(tokenInvalido.body.error.message, 'Token inválido ou expirado.');
  });

  test('logout responde 204', async () => {
    const { auth } = await registerUser('Logout', 'logout@email.com');
    const res = await api.post('/api/auth/logout').set(auth);
    assert.equal(res.status, 204);
  });
});

describe('Categorias e tarefas', () => {
  let owner;
  let other;
  let workCategory;
  let studyCategory;
  let overdueTask;

  before(async () => {
    owner = await registerUser('Dono', 'dono@email.com');
    other = await registerUser('Outro', 'outro@email.com');
  });

  test('cria, lista e edita categorias', async () => {
    const created = await api.post('/api/categories').set(owner.auth).send({ name: 'Trabalho', color: '#4f46e5' });
    assert.equal(created.status, 201);
    workCategory = created.body.category;

    const study = await api.post('/api/categories').set(owner.auth).send({ name: 'Estudos', color: '#10b981' });
    studyCategory = study.body.category;

    const updated = await api
      .put(`/api/categories/${studyCategory.id}`)
      .set(owner.auth)
      .send({ name: 'Estudos e cursos', color: '#0ea5e9' });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.category.name, 'Estudos e cursos');

    const list = await api.get('/api/categories').set(owner.auth);
    assert.deepEqual(
      list.body.categories.map((category) => category.name),
      ['Estudos e cursos', 'Trabalho'],
    );
  });

  test('categoria com nome repetido (sem diferenciar maiúsculas) retorna 409', async () => {
    const res = await api.post('/api/categories').set(owner.auth).send({ name: 'trabalho', color: '#4f46e5' });
    assert.equal(res.status, 409);
  });

  test('cria tarefa com validação dos campos', async () => {
    const invalid = await api
      .post('/api/tasks')
      .set(owner.auth)
      .send({ title: 'ab', priority: 'urgente', dueDate: '2026-02-30' });
    assert.equal(invalid.status, 400);
    assert.deepEqual(Object.keys(invalid.body.error.details).sort(), ['dueDate', 'priority', 'title']);

    const created = await api.post('/api/tasks').set(owner.auth).send({
      title: '  Finalizar relatório  ',
      description: 'Enviar para a equipe',
      priority: 'high',
      categoryId: workCategory.id,
      dueDate: isoDaysFromToday(-2),
    });
    assert.equal(created.status, 201);
    overdueTask = created.body.task;
    assert.equal(overdueTask.title, 'Finalizar relatório');
    assert.equal(overdueTask.status, 'pending');
    assert.equal(overdueTask.dueDate, isoDaysFromToday(-2));

    const minimal = await api.post('/api/tasks').set(owner.auth).send({ title: 'Ler um livro', categoryId: '', dueDate: '' });
    assert.equal(minimal.status, 201);
    assert.equal(minimal.body.task.priority, 'medium');
    assert.equal(minimal.body.task.categoryId, null);
    assert.equal(minimal.body.task.dueDate, null);

    await api.post('/api/tasks').set(owner.auth).send({
      title: 'Estudar React',
      priority: 'low',
      categoryId: studyCategory.id,
      dueDate: isoDaysFromToday(3),
    });
  });

  test('lista com pesquisa, filtros e ordenação', async () => {
    const all = await api.get('/api/tasks').set(owner.auth);
    assert.equal(all.body.tasks.length, 3);

    const search = await api.get('/api/tasks?search=relat').set(owner.auth);
    assert.deepEqual(search.body.tasks.map((task) => task.title), ['Finalizar relatório']);

    const overdue = await api.get('/api/tasks?status=overdue').set(owner.auth);
    assert.deepEqual(overdue.body.tasks.map((task) => task.id), [overdueTask.id]);

    const byCategory = await api.get(`/api/tasks?category=${studyCategory.id}`).set(owner.auth);
    assert.deepEqual(byCategory.body.tasks.map((task) => task.title), ['Estudar React']);

    const noCategory = await api.get('/api/tasks?category=none').set(owner.auth);
    assert.deepEqual(noCategory.body.tasks.map((task) => task.title), ['Ler um livro']);

    const byPriority = await api.get('/api/tasks?sort=priority').set(owner.auth);
    assert.deepEqual(
      byPriority.body.tasks.map((task) => task.priority),
      ['high', 'medium', 'low'],
    );

    const invalidFilter = await api.get('/api/tasks?status=qualquer').set(owner.auth);
    assert.equal(invalidFilter.status, 400);
  });

  test('edita, conclui e reabre tarefa', async () => {
    const updated = await api.put(`/api/tasks/${overdueTask.id}`).set(owner.auth).send({
      title: 'Finalizar relatório mensal',
      description: 'Enviar para a equipe',
      priority: 'high',
      categoryId: workCategory.id,
      dueDate: isoDaysFromToday(1),
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.task.title, 'Finalizar relatório mensal');

    const done = await api.patch(`/api/tasks/${overdueTask.id}/status`).set(owner.auth).send({ status: 'completed' });
    assert.equal(done.body.task.status, 'completed');
    assert.ok(done.body.task.completedAt);

    const completedList = await api.get('/api/tasks?status=completed').set(owner.auth);
    assert.equal(completedList.body.tasks.length, 1);

    const reopened = await api.patch(`/api/tasks/${overdueTask.id}/status`).set(owner.auth).send({ status: 'pending' });
    assert.equal(reopened.body.task.status, 'pending');
    assert.equal(reopened.body.task.completedAt, null);
  });

  test('um usuário não acessa dados de outro', async () => {
    const list = await api.get('/api/tasks').set(other.auth);
    assert.equal(list.body.tasks.length, 0);

    const read = await api.get(`/api/tasks/${overdueTask.id}`).set(other.auth);
    assert.equal(read.status, 404);

    const edit = await api.patch(`/api/tasks/${overdueTask.id}/status`).set(other.auth).send({ status: 'completed' });
    assert.equal(edit.status, 404);

    const remove = await api.delete(`/api/tasks/${overdueTask.id}`).set(other.auth);
    assert.equal(remove.status, 404);

    const useCategory = await api.post('/api/tasks').set(other.auth).send({ title: 'Tarefa', categoryId: workCategory.id });
    assert.equal(useCategory.status, 400);
    assert.equal(useCategory.body.error.details.categoryId, 'Categoria não encontrada.');
  });

  test('excluir categoria deixa as tarefas sem categoria', async () => {
    const res = await api.delete(`/api/categories/${workCategory.id}`).set(owner.auth);
    assert.equal(res.status, 204);

    const task = await api.get(`/api/tasks/${overdueTask.id}`).set(owner.auth);
    assert.equal(task.body.task.categoryId, null);
  });

  test('exclui tarefa e valida identificadores', async () => {
    const invalidId = await api.delete('/api/tasks/123').set(owner.auth);
    assert.equal(invalidId.status, 400);

    const removed = await api.delete(`/api/tasks/${overdueTask.id}`).set(owner.auth);
    assert.equal(removed.status, 204);

    const again = await api.get(`/api/tasks/${overdueTask.id}`).set(owner.auth);
    assert.equal(again.status, 404);
  });
});
