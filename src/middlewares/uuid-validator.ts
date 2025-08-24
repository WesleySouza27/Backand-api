import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiResponse } from '../utils/api-response';

const uuidSchema = z.string().uuid();

export function validarUuidParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params?.[paramName];
    const parsed = uuidSchema.safeParse(value);
    if (!parsed.success) {
      ApiResponse.error(res, `Parâmetro ${paramName} inválido`, null, 400);
      return;
    }
    next();
  };
}