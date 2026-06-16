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
      schema: {
        body: {
          type: "object",
          required: [
            "title",
            "priority",
            "estimatedHours",
            "requiredSkill",
            "dueDate"
          ],
          properties: {
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            priority: {
              type: "string",
              enum: [
                "Low",
                "Medium",
                "High"
              ]
            },
            estimatedHours: {
              type: "number"
            },
            requiredSkill: {
              type: "string"
            },
            dueDate: {
              type: "string"
            }
          }
        }
      },
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
      schema: {
        body: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            status: {
              type: "string",
              enum: [
                "Pending",
                "In Progress",
                "Completed"
              ]
            },
            priority: {
              type: "string",
              enum: [
                "Low",
                "Medium",
                "High"
              ]
            },
            estimatedHours: {
              type: "number"
            },
            requiredSkill: {
              type: "string"
            },
            assignedUser: {
              type: "string"
            },
            dueDate: {
              type: "string"
            }
          }
        }
      },
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
      schema: {
        body: {
          type: "object",
          required: [
            "userId"
          ],
          properties: {
            userId: {
              type: "string"
            }
          }
        }
      },
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
      schema: {
        body: {
          type: "object",
          required: [
            "status"
          ],
          properties: {
            status: {
              type: "string",
              enum: [
                "Pending",
                "In Progress",
                "Completed"
              ]
            }
          }
        }
      },
      preHandler: [
        verifyToken,
        taskOwnerOrAdmin
      ]
    },
    TaskController.updateStatus
  );
}
