import { FastifyInstance } from "fastify";

import { verifyToken } from "../../middleware/auth.middleware";
import { ownerOrAdmin } from "../../middleware/owner-or-admin.middleware";
import { allowRoles } from "../../middleware/role.middleware";

import { UserController } from "./user.controller";


export async function userRoutes(
  fastify: FastifyInstance
) {

  fastify.get(
    "/",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin")
      ]
    },
    UserController.getUsers
  );

  fastify.get(
    "/:id",
    {
      preHandler: [verifyToken, ownerOrAdmin]
    },
    UserController.getUser
  );

  fastify.patch(
    "/:id/skills",
    {
      preHandler: [verifyToken, ownerOrAdmin]
    },
    UserController.updateSkills
  );

  fastify.patch(
    "/:id/availability",
    {
      preHandler: [verifyToken, ownerOrAdmin]
    },
    UserController.updateAvailability
  );
}