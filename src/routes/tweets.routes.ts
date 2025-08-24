import express from 'express';
import {
  criarTweetController,
  obterTweetPorIdController,
  atualizarTweetController,
  deletarTweetController,
  obterTodosTweetsController,
  obterFeedController
} from '../controllers/tweet.controller';
import { autenticar } from '../middlewares/autenticacao';

const tweetRoutes = express.Router();

// Rotas específicas primeiro
tweetRoutes.get('/feed', autenticar, obterFeedController);
tweetRoutes.get('/', obterTodosTweetsController);

// Sem regex no path — validação de UUID fica no controller


tweetRoutes.post('/', autenticar, criarTweetController);
tweetRoutes.put('/:id', autenticar, atualizarTweetController);
tweetRoutes.delete('/:id', autenticar, deletarTweetController);
tweetRoutes.get('/:id', obterTweetPorIdController);
// Replies
tweetRoutes.post('/:tweetId/reply', autenticar, criarTweetController);

export { tweetRoutes };