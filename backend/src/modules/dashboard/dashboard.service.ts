import { Task } from "../tasks/task.model";
import { User } from "../users/user.model";

export class DashboardService {

    static async getDashboard() {

        const [
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            totalUsers
        ] = await Promise.all([

            Task.countDocuments(),

            Task.countDocuments({
                status: "Pending"
            }),

            Task.countDocuments({
                status: "In Progress"
            }),

            Task.countDocuments({
                status: "Completed"
            }),

            User.countDocuments()
        ]);

        return {
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            totalUsers
        };
    }

    static async getWorkload() {

        const users =
            await User.find()
                .select("-password");

        const tasks =
            await Task.aggregate([
                {
                    $match: {
                        assignedUser: {
                            $exists: true
                        },
                        status: {
                            $ne: "Completed"
                        }
                    }
                },
                {
                    $group: {
                        _id: "$assignedUser",

                        allocatedHours: {
                            $sum:
                                "$estimatedHours"
                        },

                        taskCount: {
                            $sum: 1
                        }
                    }
                }
            ]);

        const workloadMap =
            new Map(
                tasks.map(
                    (item) => [
                        item._id.toString(),
                        item
                    ]
                )
            );

        return users.map(
            (user) => {

                const taskData =
                    workloadMap.get(
                        user._id.toString()
                    );

                const allocatedHours =
                    taskData
                        ?.allocatedHours ??
                    0;

                const availableHours =
                    user.availableHoursPerDay *
                    user.workingDays.length;

                return {

                    userId:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    availableHours,

                    allocatedHours,

                    remainingHours:
                        availableHours -
                        allocatedHours,

                    taskCount:
                        taskData?.taskCount ??
                        0
                };
            }
        );
    }
}