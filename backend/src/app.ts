import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { taskRoutes } from "./modules/tasks/task.routes";





const app = Fastify({
  logger: true
});

app.register(cors);

// Swagger config
app.register(swagger, {
  swagger: {
    info: {
      title: "My API",
      description: "API Documentation",
      version: "1.0.0"
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"]
  }
});

// Swagger UI
app.register(swaggerUI, {routePrefix: "/docs"});

app.register(authRoutes,{  prefix: "/api/auth"});
app.register(userRoutes,{  prefix: "/api/users"});
app.register(taskRoutes,{  prefix: "/api/tasks"});

app.get("/health", async () => {
  return {
    success: true,
    message: "Backend Service Running"
  };
});

export default app;