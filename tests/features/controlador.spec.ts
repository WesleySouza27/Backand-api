import { getUserByIdController } from '../../src/controllers/usuarios.controller';
import { Request, Response, NextFunction } from 'express';
import { prismaMock } from '../config/prisma.mock';

describe('getUserByIdController', () => {
  it('deve retornar 200 e o usuário quando encontrado', async () => {
    const mockUser = {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'senha123',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      avatar: null,
    };

    prismaMock.usuario.findUnique.mockResolvedValue(mockUser);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await getUserByIdController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: 'Usuário encontrado com sucesso',
      dados: {
        id: mockUser.id,
        nome: mockUser.nome,
        email: mockUser.email,
        avatar: mockUser.avatar,
    },
    });
  });

  it('deve retornar 404 quando o usuário não for encontrado', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const req = { params: { id: '999' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await getUserByIdController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: false,
      mensagem: 'Usuário não encontrado',
      dados: null,
    });
  });

  it('deve chamar next com erro em caso de falha', async () => {
    prismaMock.usuario.findUnique.mockRejectedValue(new Error('Erro no banco de dados'));

    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await getUserByIdController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});