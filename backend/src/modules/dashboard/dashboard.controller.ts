import {
  FastifyReply,
  FastifyRequest
} from "fastify";

import { DashboardService }
from "./dashboard.service";

export class DashboardController {

  static async getDashboard(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {

      const data =
        await DashboardService.getDashboard();

      return reply.send({
        success: true,
        data
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message:
          error.message
      });

    }
  }

  static async getWorkload(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {

      const data =
        await DashboardService.getWorkload();

      return reply.send({
        success: true,
        data
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message:
          error.message
      });

    }
  }
}