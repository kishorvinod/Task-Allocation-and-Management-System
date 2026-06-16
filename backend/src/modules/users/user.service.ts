import { User } from "./user.model";

export class UserService {

    static async getUsers() {
        return User.find().select("-password");
    }

    static async getUser(id: string) {
        return User.findById(id).select("-password");
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