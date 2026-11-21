import bcrypt from 'bcryptjs';
import { toPublicUser } from '../models/userModel.js';
import * as userRepository from '../repositories/userRepository.js';
import { AppError } from '../utils/AppError.js';
import { isUniqueViolation } from '../utils/postgresErrors.js';
import { signToken } from '../utils/token.js';

const SALT_ROUNDS = 10;
const EMAIL_IN_USE = 'Este e-mail já está cadastrado.';

function buildSession(userRow) {
  return { user: toPublicUser(userRow), token: signToken(userRow.id) };
}

export async function register({ name, email, password }) {
  if (await userRepository.findByEmail(email)) {
    throw AppError.conflict(EMAIL_IN_USE, { email: EMAIL_IN_USE });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await userRepository.create({ name, email, passwordHash });
    return buildSession(user);
  } catch (error) {
    if (isUniqueViolation(error)) throw AppError.conflict(EMAIL_IN_USE, { email: EMAIL_IN_USE });
    throw error;
  }
}

export async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  const isValid = user ? await bcrypt.compare(password, user.password_hash) : false;

  // Mensagem genérica para não revelar quais e-mails estão cadastrados.
  if (!isValid) throw AppError.unauthorized('E-mail ou senha inválidos.');

  return buildSession(user);
}

export async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw AppError.unauthorized('Usuário não encontrado.');
  return toPublicUser(user);
}
