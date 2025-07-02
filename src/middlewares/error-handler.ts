import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response';
import { Prisma } from '@prisma/client';

/**
 * Middleware para tratar erros de forma global.
 * Captura erros que ocorrem durante a execução das rotas e os formata em uma resposta JSON consistente.
 */
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  let codigo = 500;
  let mensagem = 'Erro interno do servidor';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      codigo = 409;
      mensagem = 'Registro duplicado.';
    }
    if (err.code === 'P2025') {
      codigo = 404;
      mensagem = 'Registro não encontrado.';
    }
  } else if (err instanceof Error) {
    mensagem = err.message;
    if (mensagem === 'Token de autenticação inválido') {
      codigo = 401;
    } else if (mensagem === 'Usuário não encontrado') {
      codigo = 404;
    } else if (mensagem === 'Email já cadastrado') {
      codigo = 409;
    }
  }

  // Formata a resposta de erro usando a classe ApiResponse
  return res.status(codigo).json({
    sucesso: false,
    mensagem,
    dados: null,
  });
}

export { errorHandler };