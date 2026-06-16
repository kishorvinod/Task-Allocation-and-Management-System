import app from "./app";
import { connectDB } from "./database/mongodb";
import { env } from "./config/env";

const startServer = async () => {
  try {
    await connectDB();

    await app.listen({
      port: env.port,
      host: "0.0.0.0"
    });

    console.log(
      `Server running on port ${env.port}`
    );
  } catch (error) {
    app.log.error(error);

    process.exit(1);
  }
};

startServer();