import { PrismaClient, Usuario } from '@prisma/client';
import bcrypt from 'bcrypt';

const prismaClient = new PrismaClient();

// Função para criar um novo usuário
async function createUser(data: Omit<Usuario, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Usuario> {
  const hashedPassword = await bcrypt.hash(data.senha, 10);
  return prismaClient.usuario.create({
    data: { ...data, senha: hashedPassword },
  });
}

// Função para obter um usuário pelo ID
async function getUserById(id: string): Promise<Usuario | null> {
  return prismaClient.usuario.findUnique({ where: { id } });
}

// Função para atualizar um usuário
async function updateUser(id: string, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
  return prismaClient.usuario.update({ where: { id }, data });
}

// Função para deletar um usuário
async function deleteUser(id: string): Promise<Usuario> {
  return prismaClient.usuario.delete({ where: { id } });
}

// Função para encontrar usuário por email
async function findUserByEmail(email: string): Promise<Usuario | null> {
  return prismaClient.usuario.findUnique({ where: { email } });
}

// Função para comparar a senha do login
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export { createUser, getUserById, updateUser, deleteUser, findUserByEmail, comparePassword };