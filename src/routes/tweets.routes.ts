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
import { validarUuidParam } from '../middlewares/uuid-validator';

const tweetRoutes = express.Router();

// Rotas específicas primeiro
tweetRoutes.get('/feed', autenticar, obterFeedController);
tweetRoutes.get('/', obterTodosTweetsController);

// Sem regex no path — validação de UUID fica no controller
tweetRoutes.get('/:id', validarUuidParam('id'), obterTweetPorIdController);

tweetRoutes.post('/', autenticar, criarTweetController);
tweetRoutes.put('/:id', autenticar, validarUuidParam('id'), atualizarTweetController);
tweetRoutes.delete('/:id', autenticar, validarUuidParam('id'), deletarTweetController);

// Replies
tweetRoutes.post('/:tweetId/reply', autenticar, validarUuidParam('tweetId'), criarTweetController);

export { tweetRoutes };