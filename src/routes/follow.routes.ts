import express from 'express';
import {
  criarSeguidorController,
  obterSeguidorPorIdController,
  deletarSeguidorController,
  obterSeguidoresDoUsuarioController,
  obterSeguindoDoUsuarioController,
  verificarSeSegueController
} from '../controllers/follow.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const followRoutes = express.Router();


/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: Seguir e deixar de seguir usuários
 */

/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Seguir usuário
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followingId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seguidor criado
 */

/**
 * @swagger
 * /follows/{id}:
 *   get:
 *     summary: Buscar relação de follow por ID
 *     tags: [Follows]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relação encontrada
 *   delete:
 *     summary: Deixar de seguir
 *     tags: [Follows]
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
 *         description: Seguidor deletado
 */

/**
 * @swagger
 * /follows/seguidores/{usuarioId}:
 *   get:
 *     summary: Listar seguidores de um usuário
 *     tags: [Follows]
 *     parameters:
 *       - name: usuarioId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de seguidores
 */

/**
 * @swagger
 * /follows/seguindo/{usuarioId}:
 *   get:
 *     summary: Listar quem o usuário está seguindo
 *     tags: [Follows]
 *     parameters:
 *       - name: usuarioId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de seguindo
 */

// Rotas para seguidores (follows)
followRoutes.get('/verifica/:followerId/:followingId', verificarSeSegueController);
followRoutes.get('/seguidores/:usuarioId', obterSeguidoresDoUsuarioController);
followRoutes.get('/seguindo/:usuarioId', obterSeguindoDoUsuarioController);
followRoutes.get('/:id', obterSeguidorPorIdController);
followRoutes.post('/', autenticar, criarSeguidorController); // Apenas usuários autenticados podem seguir outros
followRoutes.delete('/:id', autenticar, deletarSeguidorController); // Apenas usuários autenticados podem deixar de seguir



export { followRoutes };