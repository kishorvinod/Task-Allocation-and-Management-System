import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT),

  jwtSecret: process.env.JWT_SECRET!,

  mongoUri: process.env.MONGO_URI!
};