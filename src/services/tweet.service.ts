import { PrismaClient, Tweet, TipoTweet } from '@prisma/client';
const prisma = new PrismaClient();
import { Prisma } from '@prisma/client';

interface TweetCreateInput {
  descricao: string;
  tipo: TipoTweet;
  usuarioId: string;
  parentId: string | null;
}


// Função para criar um tweet
async function criarTweet(dados: TweetCreateInput): Promise<Tweet> {
  return prisma.tweet.create({ data: dados });
}


// Função para criar um reply vinculado a um tweet
async function criarReply(
  descricao: string,
  usuarioId: string,
  parentId: string
): Promise<Tweet> {
  const novoReply = await prisma.tweet.create({
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
  const tweet = await prisma.tweet.findUnique({ // Use "prisma" aqui
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
  const tweetAtualizado = await prisma.tweet.update({ // Use "prisma" aqui
    where: { id },
    data: dados,
  });
  return tweetAtualizado;
}

// Função para deletar um tweet
async function deletarTweet(id: string): Promise<void> {
  await prisma.tweet.delete({ // Use "prisma" aqui
    where: { id },
  });
}

// Função para obter todos os tweets
async function obterTodosTweets(): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({ // Use "prisma" aqui
    include: {
      usuario: true,
      likes: true,
      replies: true
    },
  });
  return tweets;
}

export { criarTweet, obterTweetPorId, atualizarTweet, deletarTweet, obterTodosTweets, criarReply  };