import { Request, Response, NextFunction } from 'express';
import {
  criarLike,
  obterLikePorId,
  deletarLike,
  verificarLikeUnico
} from '../services/like.service';
import { ApiResponse } from '../utils/api-response';

// Controller para criar um novo like
async function criarLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.usuario?.id;
    const { tweetId } = req.body;

    if (!usuarioId || !tweetId) {
      ApiResponse.error(res, 'Usuário e tweet são obrigatórios', null, 400);
      return;
    }

    const likeExistente = await verificarLikeUnico(usuarioId, tweetId);
    if (likeExistente) {
      ApiResponse.error(res, 'Você já curtiu este tweet', null, 400);
      return;
    }

    const novoLike = await criarLike({ usuarioId, tweetId });
    ApiResponse.success(res, 'Like criado com sucesso', novoLike, 201);
  } catch (erro: unknown) {
    next(erro);
  }
}

// Controller para obter um like pelo ID
async function obterLikePorIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const like = await obterLikePorId(id);
    if (!like) {
      ApiResponse.error(res, 'Like não encontrado', null, 404);
      return;
    }
    ApiResponse.success(res, 'Like encontrado', like);
  } catch (erro: unknown) {
    next(erro);
  }
}

// Controller para deletar um like
async function deletarLikeController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    await deletarLike(id);
    ApiResponse.success(res, 'Like deletado com sucesso');
  } catch (erro: unknown) {
    next(erro);
  }
}

export { criarLikeController, obterLikePorIdController, deletarLikeController };