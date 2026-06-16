import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function verifyToken(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const authHeader =
            request.headers.authorization;

        if (!authHeader) {
            return reply.status(401).send({
                message: "Unauthorized"
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                env.jwtSecret
            );

        (request as any).user =
            decoded;

    } catch {
        return reply.status(401).send({
            message: "Invalid Token"
        });
    }
}