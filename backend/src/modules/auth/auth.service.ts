import bcrypt from "bcrypt";
import { User } from "../users/user.model";
import { generateToken } from "../../utils/jwt";

export class AuthService {
    static async getMe(userId: string) {
        const user =
            await User.findById(userId).select(
                "-password"
            );

        if (!user) {
            throw new Error(
                "User not found"
            );
        }

        return user;
    }

    static async register(data: any) {
        const existingUser =
            await User.findOne({
                email: data.email
            });

        if (existingUser) {
            throw new Error(
                "Email already exists"
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                data.password,
                10
            );

        const user =
            await User.create({
                ...data,
                password: hashedPassword
            });

        return user;
    }

    static async login(
        email: string,
        password: string
    ) {
        const user =
            await User.findOne({
                email
            });

        if (!user) {
            throw new Error(
                "Invalid credentials"
            );
        }

        const isValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isValid) {
            throw new Error(
                "Invalid credentials"
            );
        }

        const token =
            generateToken(
                user.id,
                user.role
            );

        return {
            token,
            user
        };
    }
}
