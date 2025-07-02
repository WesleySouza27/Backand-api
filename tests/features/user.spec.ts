import request from "supertest";
import { createServer } from "../../express.server";
import { JWT } from "../../src/utils/jwt";
import { prismaMock } from "../config/prisma.mock";

const server = createServer();
const jwt = new JWT();

describe("Testes de integração - Usuários", () => {
    const mockUser = {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        senha: "senha123",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        avatar: null,
    };

    beforeEach(() => {
        prismaMock.usuario.findUnique.mockResolvedValue(mockUser);
    });

    it("deve autorizar o usuário com token válido", async () => {
        const validToken = jwt.encoder({ email: mockUser.email });

        const result = await request(server)
            .get(`/usuarios/${mockUser.id}`)
            .set("Authorization", `Bearer ${validToken}`)
            .send();

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty("sucesso", true);
        expect(result.body).toHaveProperty("dados", {
            id: mockUser.id,
            nome: mockUser.nome,
            email: mockUser.email,
            avatar: mockUser.avatar,
        });
    });

    it("deve retornar erro 401 para token ausente", async () => {
        const result = await request(server)
            .get(`/usuarios/${mockUser.id}`)
            .send();

        expect(result.statusCode).toBe(401);
        expect(result.body).toHaveProperty("sucesso", false);
        expect(result.body).toHaveProperty("mensagem", "Token de autenticação não fornecido");
    });

    it("deve retornar erro 401 para token inválido", async () => {
        const invalidToken = "invalid.token";

        const result = await request(server)
            .get(`/usuarios/${mockUser.id}`)
            .set("Authorization", `Bearer ${invalidToken}`)
            .send();

        expect(result.statusCode).toBe(401);
        expect(result.body).toHaveProperty("sucesso", false);
        expect(result.body).toHaveProperty("mensagem", "Token de autenticação inválido");
    });

    it("deve retornar erro 404 para usuário não encontrado", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null);
        const validToken = jwt.encoder({ email: mockUser.email });

        const result = await request(server)
            .get(`/usuarios/999`)
            .set("Authorization", `Bearer ${validToken}`)
            .send();

        expect(result.statusCode).toBe(404);
        expect(result.body).toHaveProperty("sucesso", false);
        expect(result.body).toHaveProperty("mensagem", "Usuário não encontrado");
    });
});