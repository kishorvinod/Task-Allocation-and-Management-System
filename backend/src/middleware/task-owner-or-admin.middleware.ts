import {
  FastifyReply,
  FastifyRequest
} from "fastify";

import { Task } from "../modules/tasks/task.model";

export async function taskOwnerOrAdmin(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) {

  const currentUser =
    request.user!;

  // Admin can do everything
  if (
    currentUser.role === "admin"
  ) {
    return;
  }

  const task =
    await Task.findById(
      request.params.id
    );

  if (!task) {
    return reply.status(404).send({
      success: false,
      message: "Task not found"
    });
  }

  if (
    task.assignedUser?.toString() !==
    currentUser.userId
  ) {
    return reply.status(403).send({
      success: false,
      message: "Forbidden"
    });
  }
}