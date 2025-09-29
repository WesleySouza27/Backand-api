import { Request, Response, NextFunction } from 'express';
import { JWT } from '../utils/jwt';
import { ApiResponse } from '../utils/api-response';
import { findUserByEmail } from '../services/usuarios.service';

const jwt = new JWT();

export const autenticar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        ApiResponse.error(res, 'Token de autenticação não fornecido', null, 401);
        return;
    }

    try {
        const decoded = jwt.decoder<{ email: string }>(token); // Decodifica o token usando a classe JWT
        if (!decoded?.email) {
            ApiResponse.error(res, 'Token de autenticação inválido', null, 401);
            return;
        }
        const usuario = await findUserByEmail(decoded.email);
        if (!usuario) {
            ApiResponse.error(res, 'Usuário não encontrado', null, 404);
            return;
        }

        (req as any).usuario = { id: usuario.id, email: usuario.email };
        next();
    } catch (erro) {
        ApiResponse.error(res, 'Token de autenticação inválido', null, 401);
    }
};