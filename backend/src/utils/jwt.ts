import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (
    userId: string,
    role: string
) => {
    return jwt.sign(
        {
            userId,
            role
        },
        env.jwtSecret,
        {
            //   expiresIn: "7d"
            expiresIn: "30m"

        }
    );
};