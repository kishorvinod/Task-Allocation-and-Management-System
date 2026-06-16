import {
  FastifyReply,
  FastifyRequest
} from "fastify";

import { TaskService } from "./task.service";

export class TaskController {

  static async createTask(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {

      const user =
        request.user!;

      const task =
        await TaskService.createTask({
          ...(request.body as any),
          createdBy:
            user.userId
        });

      return reply.send({
        success: true,
        message:
          "Task created successfully",
        data: task
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async getTasks(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {

      const result =
        await TaskService.getTasks(
          request.query
        );

      return reply.send({
        success: true,
        data: result
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async getTask(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {

    try {

      const task =
        await TaskService.getTask(
          request.params.id
        );

      if (!task) {
        return reply.status(404).send({
          success: false,
          message:
            "Task not found"
        });
      }

      return reply.send({
        success: true,
        data: task
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async updateTask(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {

    try {

      const task =
        await TaskService.updateTask(
          request.params.id,
          request.body
        );

      if (!task) {
        return reply.status(404).send({
          success: false,
          message:
            "Task not found"
        });
      }

      return reply.send({
        success: true,
        message:
          "Task updated successfully",
        data: task
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async deleteTask(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {

    try {

      const task =
        await TaskService.deleteTask(
          request.params.id
        );

      if (!task) {
        return reply.status(404).send({
          success: false,
          message:
            "Task not found"
        });
      }

      return reply.send({
        success: true,
        message:
          "Task deleted successfully"
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async assignTask(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Body: {
        userId: string;
      };
    }>,
    reply: FastifyReply
  ) {

    try {

      const task =
        await TaskService.assignTask(
          request.params.id,
          request.body.userId
        );

      if (!task) {
        return reply.status(404).send({
          success: false,
          message:
            "Task not found"
        });
      }

      return reply.send({
        success: true,
        message:
          "Task assigned successfully",
        data: task
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }

  static async updateStatus(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Body: {
        status:
        | "Pending"
        | "In Progress"
        | "Completed";
      };
    }>,
    reply: FastifyReply
  ) {

    try {

      const task =
        await TaskService.updateStatus(
          request.params.id,
          request.body.status
        );

      if (!task) {
        return reply.status(404).send({
          success: false,
          message:
            "Task not found"
        });
      }

      return reply.send({
        success: true,
        message:
          "Task status updated",
        data: task
      });

    } catch (error: any) {

      return reply.status(500).send({
        success: false,
        message: error.message
      });

    }
  }
}