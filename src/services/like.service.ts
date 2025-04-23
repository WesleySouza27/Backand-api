import { PrismaClient, Like } from '@prisma/client';
const prisma = new PrismaClient();

// Função para criar um novo like
async function criarLike(dados: { usuarioId: string; tweetId: string }): Promise<Like> {
  const { usuarioId, tweetId } = dados;

  // Verifica se o like já existe
  const likeExistente = await prisma.like.findUnique({
    where: {
      usuarioId_tweetId: {
        usuarioId,
        tweetId,
      },
    },
  });

  if (likeExistente) {
    throw new Error('O usuário já deu like neste tweet.');
  }

  // Cria o like
  const novoLike = await prisma.like.create({
    data: {
      usuario: { connect: { id: usuarioId } },
      tweet: { connect: { id: tweetId } },
    },
  });

  return novoLike;
}

// Função para obter um like pelo ID
async function obterLikePorId(id: string): Promise<Like | null> {
  return prisma.like.findUnique({ where: { id } });
}

// Função para deletar um like
async function deletarLike(id: string): Promise<void> {
  await prisma.like.delete({ where: { id } });
}

// Função para verificar se um usuário já deu like em um tweet
async function verificarLikeUnico(usuarioId: string, tweetId: string): Promise<Like | null> {
  return prisma.like.findUnique({
    where: {
      usuarioId_tweetId: {
        usuarioId,
        tweetId,
      },
    },
  });
}

export { criarLike, obterLikePorId, deletarLike, verificarLikeUnico };