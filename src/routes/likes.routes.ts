import express from 'express';
import {
  criarLikeController,
  obterLikePorIdController,
  deletarLikeController
} from '../controllers/like.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const likeRoutes = express.Router();


/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Curtidas em tweets
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Dar like em um tweet
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tweetId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Like criado
 */

/**
 * @swagger
 * /likes/{id}:
 *   get:
 *     summary: Buscar like por ID
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like encontrado
 *   delete:
 *     summary: Remover like
 *     tags: [Likes]
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
 *         description: Like removido
 */

// Rotas para likes
likeRoutes.get('/:id', obterLikePorIdController);
likeRoutes.post('/', autenticar, criarLikeController); // Apenas usuários autenticados podem dar like
likeRoutes.delete('/:id', autenticar, deletarLikeController); // Apenas usuários autenticados podem deletar likes

export { likeRoutes };