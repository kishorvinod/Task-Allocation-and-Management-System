import api from "../api/axios";

export type TaskPriority =
    | "Low"
    | "Medium"
    | "High";

export type TaskStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

export interface CreateTaskPayload {
    title: string;
    description?: string;
    priority: TaskPriority;
    estimatedHours: number;
    requiredSkill: string;
    dueDate: string;
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    estimatedHours?: number;
    requiredSkill?: string;
    assignedUser?: string;
    dueDate?: string;
}

export const getTasks = async (
    page = 1,
    search = "",
    status = "",
    priority = ""
) => {

    const response =
        await api.get("/tasks", {
            params: {
                page,
                search,
                status,
                priority
            }
        });

    return response.data;
};

export const createTask =
    async (
        payload: CreateTaskPayload
    ) => {

        const response =
            await api.post(
                "/tasks",
                payload
            );

        return response.data;
    };

export const updateTask =
    async (
        id: string,
        payload: UpdateTaskPayload
    ) => {

        const response =
            await api.put(
                `/tasks/${id}`,
                payload
            );

        return response.data;
    };

export const deleteTask =
    async (
        id: string
    ) => {

        const response =
            await api.delete(
                `/tasks/${id}`
            );

        return response.data;
    };

export const assignTask =
    async (
        taskId: string,
        userId: string
    ) => {

        const response =
            await api.patch(
                `/tasks/${taskId}/assign`,
                {
                    userId
                }
            );

        return response.data;
    };

export const updateTaskStatus =
    async (
        taskId: string,
        status: TaskStatus
    ) => {

        const response =
            await api.patch(
                `/tasks/${taskId}/status`,
                {
                    status
                }
            );

        return response.data;
    };
