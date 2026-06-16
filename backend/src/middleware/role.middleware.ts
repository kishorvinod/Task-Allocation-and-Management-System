import { FastifyReply, FastifyRequest } from "fastify";

export const allowRoles =
  (...roles: string[]) =>
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {

    const user =
      (request as any).user;

    if (
      !roles.includes(user.role)
    ) {
      return reply
        .status(403)
        .send({
          message: "Forbidden"
        });
    }
  };