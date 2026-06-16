import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service";

export class UserController {

    static async getUsers(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const users =
            await UserService.getUsers();

        return reply.send({
            success: true,
            data: users
        });
    }

    static async getUser(
        request: FastifyRequest<{
            Params: { id: string };
        }>,
        
        reply: FastifyReply
    ) {
        const user =
            await UserService.getUser(
                request.params.id
            );

        return reply.send({
            success: true,
            data: user
        });
    }

    static async updateSkills(
        request: FastifyRequest<{
            Params: { id: string };
            Body: { skills: string[] };
        }>,

        reply: FastifyReply
    ) {
        const user =
            await UserService.updateSkills(
                request.params.id,
                request.body.skills
            );

        return reply.send({
            success: true,
            data: user
        });
    }

    static async updateAvailability(
        request: FastifyRequest<{
            Params: { id: string };
            Body: {
                availableHoursPerDay: number;
                workingDays: string[];
            };
        }>,
        reply: FastifyReply
    ) {
        const user =
            await UserService.updateAvailability(
                request.params.id,
                request.body
            );

        return reply.send({
            success: true,
            data: user
        });
    }
}