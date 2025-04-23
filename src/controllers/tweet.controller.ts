import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import {
  criarTweet,
  criarReply,
  obterTweetPorId,
  atualizarTweet,
  deletarTweet,
  obterTodosTweets
} from '../services/tweet.service';
import { ApiResponse } from '../utils/api-response';



// Controller para criar um novo tweet ou reply
async function criarTweetController(req: Request, res: Response, next: NextFunction) {
  try {
    const { descricao, tipo } = req.body;
    const usuarioId = req.usuario?.id; // Obtém o ID do usuário autenticado do middleware
    const parentId = req.params.tweetId || null; // Obtém o ID do tweet original, se for um reply

    if (!descricao) {
      ApiResponse.error(res, 'A descrição é obrigatória', null, 400);
      return;
    }

    if (!usuarioId) {
      ApiResponse.error(res, 'Usuário não autenticado', null, 401);
      return;
    }

    let novoTweet;
    if (parentId) {
      // Cria um reply
      novoTweet = await criarReply(descricao, usuarioId, parentId);
    } else {
      // Cria um tweet normal
      novoTweet = await criarTweet({
        descricao,
        tipo: tipo || 'tweet', // Define o tipo como "tweet" por padrão
        usuarioId,
        parentId,
      });
    }

    ApiResponse.success(res, 'Tweet criado com sucesso', novoTweet, 201);
  } catch (erro: unknown) {
    next(erro);
  }
}

// Controller para obter um tweet pelo ID
async function obterTweetPorIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const tweet = await obterTweetPorId(id);
    if (!tweet) {
      ApiResponse.error(res, 'Tweet não encontrado', null, 404);
      return;
    }
    ApiResponse.success(res, 'Tweet encontrado', tweet);
  } catch (erro: any) {
    next(erro);
  }
}

// Controller para atualizar um tweet
async function atualizarTweetController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const dados: Prisma.TweetUpdateInput = req.body;
    const tweetAtualizado = await atualizarTweet(id, dados);
    ApiResponse.success(res, 'Tweet atualizado com sucesso', tweetAtualizado);
  } catch (erro: any) {
    next(erro);
  }
}

// Controller para deletar um tweet
async function deletarTweetController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    await deletarTweet(id);
    ApiResponse.success(res, 'Tweet deletado com sucesso');
  } catch (erro: any) {
    next(erro);
  }
}

async function obterTodosTweetsController(req: Request, res: Response, next: NextFunction) {
  try {
    const tweets = await obterTodosTweets();
    ApiResponse.success(res, 'Tweets encontrados', tweets);
  } catch (error) {
    next(error);
  }
}


export { criarTweetController, obterTweetPorIdController, atualizarTweetController, deletarTweetController, obterTodosTweetsController };