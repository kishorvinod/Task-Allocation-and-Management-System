import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { taskRoutes } from "./modules/tasks/task.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { registerErrorHandler } from "./utils/error-handler";
import { registerSwagger } from "./utils/swagger";


const app = Fastify({ logger: true });

registerErrorHandler(app);
registerSwagger(app);

app.register(cors, {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  methods: [
    "GET",
    "POST",
    "PATCH",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
});


app.register(authRoutes, { prefix: "/api/auth" });
app.register(userRoutes, { prefix: "/api/users" });
app.register(taskRoutes, { prefix: "/api/tasks" });
app.register(dashboardRoutes, { prefix: "/api/dashboard" });

app.get("/health", async () => {
  return {
    success: true,
    message: "Backend Service Running"
  };
});

export default app;
