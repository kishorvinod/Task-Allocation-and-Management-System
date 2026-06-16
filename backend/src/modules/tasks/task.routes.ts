import { FastifyInstance } from "fastify";

import { verifyToken } from "../../middleware/auth.middleware";
import { taskOwnerOrAdmin } from "../../middleware/task-owner-or-admin.middleware"
import { allowRoles } from "../../middleware/role.middleware";

import { TaskController } from "./task.controller";

export async function taskRoutes(
  fastify: FastifyInstance
) {

  fastify.post(
    "/",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin")
      ]
    },
    TaskController.createTask
  );

  fastify.get(
    "/",
    {
      preHandler: [
        verifyToken
      ]
    },
    TaskController.getTasks
  );

  fastify.get(
    "/:id",
    {
      preHandler: [
        verifyToken,taskOwnerOrAdmin
      ]
    },
    TaskController.getTask
  );

  fastify.put(
    "/:id",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin"),
        taskOwnerOrAdmin
      ]
    },
    TaskController.updateTask
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin"),
        taskOwnerOrAdmin
      ]
    },
    TaskController.deleteTask
  );

  fastify.patch(
    "/:id/assign",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin"),
        taskOwnerOrAdmin
      ]
    },
    TaskController.assignTask
  );

  fastify.patch(
    "/:id/status",
    {
      preHandler: [
        verifyToken,
        taskOwnerOrAdmin
      ]
    },
    TaskController.updateStatus
  );
}