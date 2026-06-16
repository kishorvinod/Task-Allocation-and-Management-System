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

  fastify.put<{
    Params: {
      id: string;
    };
    Body: {
      name?: string;
      email?: string;
      password?: string;
      role?: "admin" | "user";
      skills?: string[];
      availableHoursPerDay?: number;
      workingDays?: string[];
    };
  }>(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            email: {
              type: "string"
            },
            password: {
              type: "string"
            },
            role: {
              type: "string",
              enum: [
                "admin",
                "user"
              ]
            },
            skills: {
              type: "array",
              items: {
                type: "string"
              }
            },
            availableHoursPerDay: {
              type: "number"
            },
            workingDays: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      },
      preHandler: [
        verifyToken,
        allowRoles("admin")
      ]
    },
    UserController.updateUser
  );

  fastify.delete<{
    Params: {
      id: string;
    };
  }>(
    "/:id",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin")
      ]
    },
    UserController.deleteUser
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
