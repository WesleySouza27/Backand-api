import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { userRoutes } from './routes/usuarios.routes';
import { tweetRoutes } from './routes/tweets.routes';
import { likeRoutes } from './routes/likes.routes';
import { followRoutes } from './routes/follow.routes';
import { errorHandler } from './middlewares/error-handler';
import { ApiResponse } from './utils/api-response';

const app: Application = express();

// Middlewares globais
app.use(express.json());
app.use(cors({ origin: 'https://grow-tweeter-full-stack.vercel.app/' }));

// Rotas da aplicação
app.use('/usuarios', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/likes', likeRoutes);
app.use('/follows', followRoutes);
app.use(errorHandler); // Use o middleware de tratamento de erros

// Middleware de exemplo para lidar com rotas não encontradas (opcional)
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Rota não encontrada', null, 404);
});

export { app };