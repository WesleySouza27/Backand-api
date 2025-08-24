import { PrismaClient, Tweet, TipoTweet } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../database/prisma.client';

interface TweetCreateInput {
  descricao: string;
  tipo: TipoTweet;
  usuarioId: string;
  parentId: string | null;
}


// Função para criar um tweet
async function criarTweet(dados: TweetCreateInput): Promise<Tweet> {
  return prismaClient.tweet.create({ data: dados });
}


// Função para criar um reply vinculado a um tweet
async function criarReply(
  descricao: string,
  usuarioId: string,
  parentId: string
): Promise<Tweet> {
  const novoReply = await prismaClient.tweet.create({
    data: {
      descricao,
      tipo: 'reply', // Define o tipo como "reply"
      usuarioId: usuarioId,
      parentId: parentId, // Vincula ao tweet original
    },
  });
  return novoReply;
}

// Função para obter um tweet pelo ID
async function obterTweetPorId(id: string): Promise<Tweet | null> {
  const tweet = await prismaClient.tweet.findUnique({ // Use "prisma" aqui
    where: { id },
    include: {
      usuario: true, // Inclui os dados do usuário que criou o tweet
      likes: true,    // Inclui os likes do tweet
      replies: true,  // Inclui as respostas ao tweet
      parent: true
    },
  });
  return tweet;
}

// Função para atualizar um tweet
async function atualizarTweet(id: string, dados: Prisma.TweetUpdateInput): Promise<Tweet> {
  const tweetAtualizado = await prismaClient.tweet.update({ // Use "prisma" aqui
    where: { id },
    data: dados,
  });
  return tweetAtualizado;
}

// Função para deletar um tweet
async function deletarTweet(id: string): Promise<void> {
  await prismaClient.tweet.delete({ // Use "prisma" aqui
    where: { id },
  });
}

// Função para obter todos os tweets
async function obterTodosTweets(): Promise<Tweet[]> {
  const tweets = await prismaClient.tweet.findMany({ // Use "prisma" aqui
    include: {
      usuario: true,
      likes: true,
      replies: true
    },
  });
  return tweets;
}

// Função para buscar o feed do usuário autenticado
async function obterFeedDoUsuario(usuarioId: string): Promise<Tweet[]> {
  const seguindo = await prismaClient.follower.findMany({
    where: { followerId: usuarioId },
    select: { followingId: true },
  });
  const ids = [usuarioId, ...seguindo.map((s) => s.followingId)];
  return prismaClient.tweet.findMany({
    where: { usuarioId: { in: ids } },
    orderBy: { criadoEm: 'desc' },
    include: { usuario: true, replies: true },
  });
}

export { criarTweet, obterTweetPorId, atualizarTweet, deletarTweet, obterTodosTweets, criarReply, obterFeedDoUsuario  };