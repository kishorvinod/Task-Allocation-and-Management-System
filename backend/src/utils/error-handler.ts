import {
  FastifyInstance,
  FastifyError
} from "fastify";

export async function registerErrorHandler(
  fastify: FastifyInstance
) {

  fastify.setErrorHandler(
    (
      error: FastifyError,
      request,
      reply
    ) => {

      request.log.error(error);

      return reply.status(
        error.statusCode || 500
      ).send({
        success: false,
        message:
          error.message ||
          "Internal Server Error"
      });
    }
  );
}