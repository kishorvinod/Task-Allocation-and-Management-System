import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

export async function authRoutes(
    fastify: FastifyInstance
) {
    fastify.get("/me", {
        preHandler: [verifyToken]
    }, AuthController.me);

    fastify.post("/register", {
        schema: {
            description: "Register a new user",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    }, AuthController.register);

    fastify.post("/login", AuthController.login);
}
