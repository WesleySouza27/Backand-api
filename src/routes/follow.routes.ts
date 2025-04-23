import express from 'express';
import {
  criarSeguidorController,
  obterSeguidorPorIdController,
  deletarSeguidorController,
  obterSeguidoresDoUsuarioController,
  obterSeguindoDoUsuarioController
} from '../controllers/follow.controller';
import { autenticar } from '../middlewares/autenticacao'; // Importe o middleware de autenticação

const followRoutes = express.Router();

// Rotas para seguidores (follows)
followRoutes.get('/:id', obterSeguidorPorIdController);
followRoutes.post('/', autenticar, criarSeguidorController); // Apenas usuários autenticados podem seguir outros
followRoutes.delete('/:id', autenticar, deletarSeguidorController); // Apenas usuários autenticados podem deixar de seguir

followRoutes.get('/seguidores/:usuarioId', obterSeguidoresDoUsuarioController);
followRoutes.get('/seguindo/:usuarioId', obterSeguindoDoUsuarioController);

export { followRoutes };