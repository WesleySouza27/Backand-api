import express from 'express';
import {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
} from '../controllers/usuarios.controller';
import { autenticar } from '../middlewares/autenticacao';

const userRoutes = express.Router();

// Defina as rotas para usuários
userRoutes.post('/', createUserController);
userRoutes.get('/:id', autenticar, getUserByIdController);
userRoutes.put('/:id', autenticar, updateUserController);
userRoutes.delete('/:id', autenticar, deleteUserController);
userRoutes.post('/login', loginUserController); // Rota de login


export { userRoutes };
