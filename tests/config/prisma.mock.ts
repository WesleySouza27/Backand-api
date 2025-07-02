import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { prismaClient as prisma} from "../../src/database/prisma.client";
jest.mock("../../src/database/prisma.client", () => ({
    __esModule: true,
    prismaClient: mockDeep<PrismaClient>(),
    }));
beforeEach(() => {
    mockReset(prismaMock);
    prismaMock.usuario.findUnique.mockResolvedValue({
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        senha: "senha123",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        avatar: null,
    });
});
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;