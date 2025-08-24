import express from 'express';
import {
  criarTweetController,
  obterTweetPorIdController,
  atualizarTweetController,
  deletarTweetController,
  obterTodosTweetsController,
  obterFeedController
} from '../controllers/tweet.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const tweetRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Gerenciamento de tweets e replies
 */

/**
 * @swagger
 * /tweets:
 *   get:
 *     summary: Listar todos os tweets
 *     tags: [Tweets]
 *     responses:
 *       200:
 *         description: Lista de tweets
 *   post:
 *     summary: Criar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tweet criado
 */

/**
 * @swagger
 * /tweets/feed:
 *   get:
 *     summary: Feed do usuário autenticado
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feed retornado
 */

/**
 * @swagger
 * /tweets/{id}:
 *   get:
 *     summary: Buscar tweet por ID
 *     tags: [Tweets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet encontrado
 *   put:
 *     summary: Atualizar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tweet atualizado
 *   delete:
 *     summary: Deletar tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet deletado
 */

/**
 * @swagger
 * /tweets/{tweetId}/reply:
 *   post:
 *     summary: Criar reply para um tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tweetId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply criada
 */

// Rotas para tweets
tweetRoutes.get('/', obterTodosTweetsController);
tweetRoutes.get('/:id', obterTweetPorIdController);
tweetRoutes.get('/feed', autenticar, obterFeedController); // Feed do usuário autenticado
tweetRoutes.post('/', autenticar, criarTweetController); // Apenas usuários autenticados podem criar tweets
tweetRoutes.put('/:id', autenticar, atualizarTweetController); // Apenas usuários autenticados podem atualizar tweets
tweetRoutes.delete('/:id', autenticar, deletarTweetController); // Apenas usuários autenticados podem deletar tweets
tweetRoutes.post('/:tweetId/reply', autenticar, criarTweetController); // Apenas usuários autenticados podem criar replies

export { tweetRoutes };