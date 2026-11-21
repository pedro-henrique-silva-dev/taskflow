import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Limita tentativas de login/cadastro para dificultar ataques de força bruta.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => env.nodeEnv === 'test',
  message: { error: { message: 'Muitas tentativas. Tente novamente em alguns minutos.' } },
});
