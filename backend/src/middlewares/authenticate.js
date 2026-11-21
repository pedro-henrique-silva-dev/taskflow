import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/token.js';

// Exige o cabeçalho "Authorization: Bearer <token>" e disponibiliza req.userId.
export function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw AppError.unauthorized('Token de autenticação não informado.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw AppError.unauthorized('Token inválido ou expirado.');
  }

  req.userId = payload.sub;
  next();
}
