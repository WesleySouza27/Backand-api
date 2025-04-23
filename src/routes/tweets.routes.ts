import express from 'express';
import {
  criarTweetController,
  obterTweetPorIdController,
  atualizarTweetController,
  deletarTweetController,
  obterTodosTweetsController
} from '../controllers/tweet.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const tweetRoutes = express.Router();

// Rotas para tweets
tweetRoutes.get('/', obterTodosTweetsController);
tweetRoutes.get('/:id', obterTweetPorIdController);
tweetRoutes.post('/', autenticar, criarTweetController); // Apenas usuários autenticados podem criar tweets
tweetRoutes.put('/:id', autenticar, atualizarTweetController); // Apenas usuários autenticados podem atualizar tweets
tweetRoutes.delete('/:id', autenticar, deletarTweetController); // Apenas usuários autenticados podem deletar tweets
tweetRoutes.post('/:tweetId/reply', autenticar, criarTweetController); // Apenas usuários autenticados podem criar replies

export { tweetRoutes };