import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { FastifyInstance } from "fastify";

export async function registerSwagger(
  fastify: FastifyInstance
) {

  await fastify.register(
    swagger,
    {
      openapi: {
        info: {
          title:
            "Task Management API",
          version: "1.0.0"
        }
      }
    }
  );

  await fastify.register(
    swaggerUi,
    {
      routePrefix:
        "/docs"
    }
  );
}