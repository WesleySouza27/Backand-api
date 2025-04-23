import { app } from './app';
import { prismaClient } from './database/prisma.client';
import { Usuario } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario; // Adiciona a propriedade `usuario` ao tipo Request
    }
  }
}

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});