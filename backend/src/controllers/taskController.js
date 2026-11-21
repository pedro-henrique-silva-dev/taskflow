import * as taskService from '../services/taskService.js';

export async function list(req, res) {
  const tasks = await taskService.list(req.userId, req.validated.query);
  res.json({ tasks });
}

export async function getById(req, res) {
  const task = await taskService.getById(req.userId, req.validated.params.id);
  res.json({ task });
}

export async function create(req, res) {
  const task = await taskService.create(req.userId, req.validated.body);
  res.status(201).json({ task });
}

export async function update(req, res) {
  const task = await taskService.update(req.userId, req.validated.params.id, req.validated.body);
  res.json({ task });
}

export async function setStatus(req, res) {
  const task = await taskService.setStatus(
    req.userId,
    req.validated.params.id,
    req.validated.body.status,
  );
  res.json({ task });
}

export async function remove(req, res) {
  await taskService.remove(req.userId, req.validated.params.id);
  res.status(204).end();
}
