# GrowTwitter - API e Banco de Dados

GrowTwitter é uma API desenvolvida para simular uma rede social no estilo Twitter. O projeto utiliza **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL** para gerenciar o banco de dados. Ele implementa funcionalidades como cadastro de usuários, criação de tweets, replies, likes e autenticação de usuários.

---

## 🚀 Funcionalidades

- **Usuários**:
  - Cadastro de usuários.
  - Login com autenticação JWT.
- **Tweets**:
  - Criação de tweets.
  - Criação de replies vinculados a tweets.
  - Listagem de tweets e replies.
  - Atualização e exclusão de tweets.
- **Likes**:
  - Curtir tweets.
  - Restrição para evitar múltiplos likes no mesmo tweet por um usuário.
- **Seguidores**:
  - Seguir e deixar de seguir outros usuários.
- **Autenticação**:
  - Rotas protegidas por autenticação JWT.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para criação de APIs.
- **Prisma ORM**: Gerenciamento do banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **JWT (JSON Web Token)**: Autenticação de usuários.
- **TypeScript**: Tipagem estática para JavaScript.

---

## 📦 Estrutura do Projeto

```plaintext
.
├── src
│   ├── controllers       # Controladores das rotas
│   ├── middlewares       # Middlewares (ex.: autenticação)
│   ├── routes            # Definição das rotas
│   ├── services          # Lógica de negócios e integração com o banco
│   ├── utils             # Funções utilitárias
│   ├── database          # Configuração do Prisma
│   └── index.ts          # Arquivo principal do servidor
├── prisma
│   ├── schema.prisma     # Definição do modelo de banco de dados
├── @types
│   └── express           # Extensão do tipo Request do Express
├── [package.json](http://_vscodecontentref_/0)          # Dependências e scripts do projeto
└── [tsconfig.json](http://_vscodecontentref_/1)         # Configuração do TypeScript
