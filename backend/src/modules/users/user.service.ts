import bcrypt from "bcrypt";
import { User } from "./user.model";

interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
    skills?: string[];
    availableHoursPerDay?: number;
    workingDays?: string[];
}

export class UserService {

    static async getUsers() {
        return User.find().select("-password");
    }

    static async getUser(id: string) {
        return User.findById(id).select("-password");
    }

    static async updateUser(
        id: string,
        payload: UpdateUserPayload
    ) {
        const updateData: UpdateUserPayload = {
            ...payload
        };

        if (payload.email) {
            const existingUser =
                await User.findOne({
                    email: payload.email,
                    _id: { $ne: id }
                });

            if (existingUser) {
                throw new Error(
                    "Email already exists"
                );
            }
        }

        if (payload.password) {
            updateData.password =
                await bcrypt.hash(
                    payload.password,
                    10
                );
        } else {
            delete updateData.password;
        }

        return User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");
    }

    static async deleteUser(id: string) {
        return User.findByIdAndDelete(id)
            .select("-password");
    }

    static async updateSkills(
        id: string,
        skills: string[]
    ) {
        return User.findByIdAndUpdate(
            id,
            { skills },
            { new: true }
        ).select("-password");
    }

    static async updateAvailability(
        id: string,
        payload: {
            availableHoursPerDay: number;
            workingDays: string[];
        }
    ) {
        return User.findByIdAndUpdate(
            id,
            payload,
            { new: true }
        ).select("-password");
    }
}
