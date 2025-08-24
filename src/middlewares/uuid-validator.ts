import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiResponse } from '../utils/api-response';

const uuid = z.string().uuid();

export function validarUuidParam(nome: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const valor = req.params?.[nome];
    const ok = uuid.safeParse(valor).success;
    if (!ok) {
      ApiResponse.error(res, `Parâmetro ${nome} inválido`, null, 400);
      return;
    }
    next();
  };
}