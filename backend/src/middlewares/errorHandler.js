import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line no-unused-vars -- o Express identifica o handler de erro pelos 4 parâmetros
export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: { message: error.message, ...(error.details && { details: error.details }) },
    });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'JSON inválido no corpo da requisição.' } });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: { message: 'Corpo da requisição muito grande.' } });
  }

  console.error(error);
  return res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
}
