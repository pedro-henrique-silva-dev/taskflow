import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ALGORITHM = 'HS256';

export function signToken(userId) {
  return jwt.sign({}, env.jwt.secret, {
    algorithm: ALGORITHM,
    subject: userId,
    expiresIn: env.jwt.expiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret, { algorithms: [ALGORITHM] });
}
