import express from 'express';
import {
  criarLikeController,
  obterLikePorIdController,
  deletarLikeController
} from '../controllers/like.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const likeRoutes = express.Router();

// Rotas para likes
likeRoutes.get('/:id', obterLikePorIdController);
likeRoutes.post('/', autenticar, criarLikeController); // Apenas usuários autenticados podem dar like
likeRoutes.delete('/:id', autenticar, deletarLikeController); // Apenas usuários autenticados podem deletar likes

export { likeRoutes };