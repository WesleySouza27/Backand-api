import { Response } from 'express';

class ApiResponse {
  static success<T>(res: Response, mensagem: string, dados?: T, codigo: number = 200) {
    return res.status(codigo).json({
      sucesso: true,
      mensagem,
      dados,
    });
  }

  static error(res: Response, mensagem: string, dados?: unknown, codigo: number = 400) {
    return res.status(codigo).json({
      sucesso: false,
      mensagem,
      dados,
    });
  }
}

export { ApiResponse };