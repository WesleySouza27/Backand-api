import request from "supertest";
import { createServer } from "../../../../express.server";
import { JWT } from "../../../../src/utils/jwt";
import { prismaMock } from "../../../config/prisma.mock";
import { TipoTweet } from "@prisma/client";

const server = createServer();
const jwt = new JWT();

describe("Feed de Tweets", () => {
  const usuarioId = "user-1";
  const usuario = {
    id: usuarioId,
    nome: "Usuário Teste",
    email: "teste@email.com",
    senha: "senha123",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    avatar: null,
  };

  const seguindoId = "user-2";
  const tweet1 = {
    id: "tweet-1",
    descricao: "Meu tweet",
    tipo: TipoTweet.tweet,
    usuarioId: usuarioId,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    parentId: null,
    usuario,
    likes: [],
    replies: [],
    parent: null,
  };
  const tweet2 = {
    id: "tweet-2",
    descricao: "Tweet do seguido",
    tipo: TipoTweet.tweet,
    usuarioId: seguindoId,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    parentId: null,
    usuario: { ...usuario, id: seguindoId, email: "outro@email.com" },
    likes: [],
    replies: [],
    parent: null,
  };

  beforeEach(() => {
    prismaMock.usuario.findUnique.mockResolvedValue(usuario);
    prismaMock.follower.findMany.mockResolvedValue([
      { id: "f1", followerId: usuarioId, followingId: seguindoId }
    ]);
    prismaMock.tweet.findMany.mockResolvedValue([tweet1, tweet2]);
  });

  it("deve retornar o feed do usuário autenticado", async () => {
    const token = jwt.encoder({ email: usuario.email });

    const res = await request(server)
      .get("/tweets/feed")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sucesso", true);
    expect(res.body).toHaveProperty("mensagem", "Feed encontrado");
    expect(res.body).toHaveProperty("dados");
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados.length).toBe(2);
    expect(res.body.dados[0]).toHaveProperty("descricao");
    expect(res.body.dados[1]).toHaveProperty("descricao");
  });
});