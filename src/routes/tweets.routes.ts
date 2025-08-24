import express from 'express';
import {
  obterFeedController,
  criarTweetController,
  obterTweetPorIdController,
  atualizarTweetController,
  deletarTweetController,
  obterTodosTweetsController,
} from '../controllers/tweet.controller';
import { autenticar } from '../middlewares/autenticacao';
import { validarUuidParam } from '../middlewares/uuid-validator';

const tweetRoutes = express.Router();

// Rotas específicas primeiro
tweetRoutes.get('/feed', autenticar, obterFeedController);
tweetRoutes.get('/', obterTodosTweetsController);


tweetRoutes.get('/:id', validarUuidParam('id'), obterTweetPorIdController);
tweetRoutes.post('/', autenticar, criarTweetController);
tweetRoutes.put('/:id', autenticar, validarUuidParam('id'), atualizarTweetController);
tweetRoutes.delete('/:id', autenticar, validarUuidParam('id'), deletarTweetController);

// Replies
tweetRoutes.post('/:tweetId/reply', autenticar, validarUuidParam('tweetId'), criarTweetController);

export { tweetRoutes };