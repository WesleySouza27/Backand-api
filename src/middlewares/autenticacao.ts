import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../services/usuarios.service';
import { ApiResponse } from '../utils/api-response';
import { Usuario } from '@prisma/client';

// Chave secreta para assinar os tokens JWT
const secret = process.env.JWT_SECRET || 'chave_secreta';

interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

/**
 * Middleware para autenticar as requisições.
 * Verifica se o token JWT é válido e, se for, define o usuário autenticado no objeto de requisição.
 */
const autenticar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Obtém o token do header da requisição
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Verifica se o token foi fornecido
  if (!token) {
    ApiResponse.error(res, 'Token de autenticação não fornecido', null, 401);
    return;
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, secret) as DecodedToken;

    // Busca o usuário no banco de dados pelo email extraído do token
    const usuario: Usuario | null = await findUserByEmail(decoded.email);

    // Verifica se o usuário existe
    if (!usuario) {
      ApiResponse.error(res, 'Usuário não encontrado', null, 401);
      return;
    }

    // Define o usuário autenticado no objeto de requisição para uso posterior
    req.usuario = usuario;
    next(); 
  } catch (erro: unknown) {
    // Se o token for inválido ou expirado, retorna um erro de autenticação
    ApiResponse.error(res, 'Token de autenticação inválido', null, 401);
  }
};

export { autenticar };