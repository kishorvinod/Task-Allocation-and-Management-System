import {
    FastifyRequest,
    FastifyReply
} from "fastify";

export async function ownerOrAdmin(
    request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>,
    reply: FastifyReply
) {

    const currentUser =
        request.user!;

    if (
        currentUser.role !== "admin" &&
        currentUser.userId !== request.params.id
    ) {
        return reply.status(403).send({
            success: false,
            message: "Forbidden"
        });
    }
}