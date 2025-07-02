import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GrowTwitter API",
      version: "1.0.0",
      description: "API para simular uma rede social estilo Twitter",
    },
    servers: [
      {
        url: "http://localhost:3030",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "./src/routes/*.ts", // <-- Os comentários Swagger vão nas rotas!
  ],
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}