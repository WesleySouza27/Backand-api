import { Request, Response, NextFunction } from 'express';
import { Usuario } from '@prisma/client';
import dotenv from 'dotenv';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  findUserByEmail,
  comparePassword
} from '../services/usuarios.service';
import jwt, { Secret } from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response';
//import { hash } from 'bcrypt';

dotenv.config()

const secret: Secret = process.env.JWT_SECRET || 'chave_secreta';

if (!secret) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
}
// Função para gerar o token JWT
function generateToken(usuario: Usuario): string {
  return jwt.sign({ email: usuario.email }, secret, { expiresIn: '3h' });
}

// Controller para criar um novo usuário
export async function createUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome, email, senha, avatar } = req.body;

    if (!nome || !email || !senha) {
      ApiResponse.error(res, 'Nome, email e senha são obrigatórios', null, 400);
      return;
    }

    const usuarioCriado = await createUser({ nome, email, senha, avatar });
    ApiResponse.success(res, 'Usuário criado com sucesso', usuarioCriado, 201);
  } catch (erro: unknown) {
    next(erro);
  }
}

// Controller para obter um usuário pelo ID
export async function getUserByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.params.id;
    const usuario = await getUserById(usuarioId);
    if (!usuario) {
      ApiResponse.error(res, 'Utilizador não encontrado', null, 404);
      return;
    }
    ApiResponse.success(res, 'Utilizador encontrado', usuario);
  } catch (error: unknown) {
    next(error);
  }
}

// Controller para atualizar um usuário
export async function updateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nome, email, avatar } = req.body;

    const usuarioAtualizado = await updateUser(id, { nome, email, avatar });
    ApiResponse.success(res, 'Usuário atualizado com sucesso', usuarioAtualizado, 200);
  } catch (erro: unknown) {
    next(erro);
  }
}

// Controller para deletar um usuário
export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.params.id;
    await deleteUser(usuarioId);
    ApiResponse.success(res, 'Utilizador eliminado com sucesso');
  } catch (error: unknown) {
    next(error);
  }
}

// Controller para login
export async function loginUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Valida se os campos foram fornecidos
    if (!email || !password) {
      ApiResponse.error(res, 'Email e senha são obrigatórios', null, 400);
      return;
    }

    // Encontra o usuário por email
    const usuario = await findUserByEmail(email);
    if (!usuario) {
      ApiResponse.error(res, 'usuario não encontrado', null, 401);
      return;
    }

    // Verifica a senha
    const passwordMatch = await comparePassword(password, usuario.senha);
    if (!passwordMatch) {
      ApiResponse.error(res, 'Senha ou e-mail incorreta', null, 401);
      return;
    }
      
    // Gera o token JWT
    const token = generateToken(usuario);
    
    // Retorna o token para o cliente
    ApiResponse.success(res, 'Login realizado com sucesso', {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        avatar: usuario.avatar || null
      }
    });
  } catch (erro: unknown) {
    next(erro)
  }
}