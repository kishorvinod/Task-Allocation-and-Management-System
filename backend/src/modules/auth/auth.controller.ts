import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";

export class AuthController {
    static async register(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const user =
                await AuthService.register(
                    request.body
                );

            return reply.send({
                success: true,
                data: user
            });
        } catch (error: any) {
            return reply.status(400).send({
                success: false,
                message: error.message
            });
        }
    }

    static async login(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const body =
                request.body as any;

            const result =
                await AuthService.login(
                    body.email,
                    body.password
                );

            return reply.send({
                success: true,
                data: result
            });
        } catch (error: any) {
            return reply.status(401).send({
                success: false,
                message: error.message
            });
        }
    }
}