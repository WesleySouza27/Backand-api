import { Request, Response, NextFunction } from 'express';
import {
  criarSeguidor,
  obterSeguidorPorId,
  deletarSeguidor,
  verificarSeSegue,
  obterSeguidoresDoUsuario,
  obterSeguindoDoUsuario
} from '../services/follow.service';
import { ApiResponse } from '../utils/api-response';
import { Prisma } from '@prisma/client';

// Controller para criar um novo seguidor (follow)
async function criarSeguidorController(req: Request, res: Response, next: NextFunction) {
  try {
    // Verifica se os IDs do seguidor e seguido foram fornecidos
    if (!req.body.followerId || !req.body.followingId) {
      ApiResponse.error(res, 'IDs do seguidor e seguido são obrigatórios', null, 400);
      return;
    }

    const dados: Prisma.FollowerCreateInput = {
      follower: {
        connect: {
          id: req.body.followerId,
        },
      },
      following: {
        connect: {
          id: req.body.followingId,
        },
      },
    };

    // Verifica se o usuário já segue o outro
    const jaSegue = await verificarSeSegue(req.body.followerId, req.body.followingId);
    if (jaSegue) {
      ApiResponse.error(res, 'Você já segue este usuário', null, 400);
      return;
    }
    const novoSeguidor = await criarSeguidor(dados);
    ApiResponse.success(res, 'Seguidor criado com sucesso', novoSeguidor, 201);
  } catch (erro: any) {
    next(erro);
  }
}

// Controller para obter um seguidor pelo ID
async function obterSeguidorPorIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const seguidor = await obterSeguidorPorId(id);
    if (!seguidor) {
      ApiResponse.error(res, 'Seguidor não encontrado', null, 404);
      return;
    }
    ApiResponse.success(res, 'Seguidor encontrado', seguidor);
  } catch (erro: any) {
    next(erro);
  }
}

// Controller para deletar um seguidor (unfollow)
async function deletarSeguidorController(req: Request, res: Response, next: NextFunction) {
  console.log("ID do seguidor a deletar:", req.params.id); // Adicione esta linha
  try {
        const id = req.params.id;
        await deletarSeguidor(id);
        ApiResponse.success(res, 'Seguidor deletado com sucesso');
    } catch (erro: any) {
        if (erro.message === 'Seguidor não encontrado') {
            ApiResponse.error(res, 'Seguidor não encontrado', null, 404);
            return;
        }
        next(erro);
    }
}

// Controller para obter os seguidores de um usuário
async function obterSeguidoresDoUsuarioController(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.params.usuarioId;
    const seguidores = await obterSeguidoresDoUsuario(usuarioId);
    ApiResponse.success(res, 'Seguidores encontrados', seguidores);
  } catch (erro: any) {
    next(erro);
  }
}

// Controller para obter os usuários que um usuário segue
async function obterSeguindoDoUsuarioController(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.params.usuarioId;
    const seguindo = await obterSeguindoDoUsuario(usuarioId);
    ApiResponse.success(res, 'Seguindo encontrados', seguindo);
  } catch (erro: any) {
    next(erro);
  }
}

export { criarSeguidorController, obterSeguidorPorIdController, deletarSeguidorController, obterSeguidoresDoUsuarioController, obterSeguindoDoUsuarioController };