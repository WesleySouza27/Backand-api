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
import { z } from 'zod';

const criarSeguidorSchema = z.object({
  followingId: z.string().uuid({ message: 'ID do seguido inválido' }),
});

// Controller para criar um novo seguidor (follow)
async function criarSeguidorController(req: Request, res: Response, next: NextFunction) {

  const followerId = req.usuario?.id;

  
  try {
    // Verifica se os IDs do seguidor e seguido foram fornecidos

    const parseResult = criarSeguidorSchema.safeParse(req.body);
    if (!parseResult.success) {
      ApiResponse.error(res, 'Dados inválidos', parseResult.error.errors, 400);
      return;
    }

    if (!followerId) {
      ApiResponse.error(res, 'ID do seguidor é obrigatório', null, 400);
      return;
    }

    if (!followerId || !req.body.followingId) {
      ApiResponse.error(res, 'IDs do seguidor e seguido são obrigatórios', null, 400);
      return;
    }

    if (followerId === req.body.followingId) {
      ApiResponse.error(res, 'Você não pode seguir a si mesmo', null, 400);
      return;
    }

    const dados: Prisma.FollowerCreateInput = {
      follower: {
        connect: {
          id: followerId,
        },
      },
      following: {
        connect: {
          id: req.body.followingId,
        },
      },
    };

    // Verifica se o usuário já segue o outro
    const jaSegue = await verificarSeSegue(followerId, req.body.followingId);
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

// Controller para verificar se um usuário segue outro
async function verificarSeSegueController(req: Request, res: Response, next: NextFunction) {
  try {
    const { followerId, followingId } = req.params;
    const segue = await verificarSeSegue(followerId, followingId);
    if (segue) {
      ApiResponse.success(res, 'Verificação realizada', { segue: true, id: segue.id });
    } else {
      ApiResponse.success(res, 'Verificação realizada', { segue: false, id: null });
    }
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

export { criarSeguidorController, obterSeguidorPorIdController, deletarSeguidorController, obterSeguidoresDoUsuarioController, obterSeguindoDoUsuarioController, verificarSeSegueController };