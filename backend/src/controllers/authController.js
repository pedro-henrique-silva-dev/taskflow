import * as authService from '../services/authService.js';

export async function register(req, res) {
  const session = await authService.register(req.validated.body);
  res.status(201).json(session);
}

export async function login(req, res) {
  const session = await authService.login(req.validated.body);
  res.json(session);
}

export async function me(req, res) {
  const user = await authService.getProfile(req.userId);
  res.json({ user });
}

// Com JWT a sessão não fica no servidor: o cliente descarta o token ao sair.
export function logout(_req, res) {
  res.status(204).end();
}
