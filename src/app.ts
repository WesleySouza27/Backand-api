import { setupSwagger } from "./swagger";
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { userRoutes } from './routes/usuarios.routes';
import { tweetRoutes } from './routes/tweets.routes';
import { likeRoutes } from './routes/likes.routes';
import { followRoutes } from './routes/follow.routes';
import { errorHandler } from './middlewares/error-handler';
import { ErrorRequestHandler } from 'express';
import { ApiResponse } from './utils/api-response';

const app: Application = express();

// Middlewares globais
app.use(express.json());
app.use(cors());

setupSwagger(app as any);

// Rotas da aplicação
app.use('/usuarios', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/likes', likeRoutes);
app.use('/follows', followRoutes);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API funcionando corretamente!',
    dados: null,
  });
});
 

// Rota para tratamento de erros 404
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Rota não encontrada', null, 404);
});

app.use(errorHandler as any);

export { app };