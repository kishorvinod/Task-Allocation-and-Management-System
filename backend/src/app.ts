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

app.register(cors);


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