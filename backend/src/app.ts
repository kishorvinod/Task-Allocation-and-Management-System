import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true
});

app.register(cors);

app.get("/health", async () => {
  return {
    success: true,
    message: "API Running"
  };
});

export default app;