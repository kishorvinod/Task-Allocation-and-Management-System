import {
  FastifyInstance
} from "fastify";

import {
  verifyToken
} from "../../middleware/auth.middleware";

import {
  allowRoles
} from "../../middleware/role.middleware";

import {
  DashboardController
} from "./dashboard.controller";

export async function dashboardRoutes(
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
    DashboardController.getDashboard
  );

  fastify.get(
    "/workload",
    {
      preHandler: [
        verifyToken,
        allowRoles("admin")
      ]
    },
    DashboardController.getWorkload
  );
}