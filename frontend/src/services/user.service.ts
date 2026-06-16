import api from "../api/axios";

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
    skills?: string[];
    availableHoursPerDay?: number;
    workingDays?: string[];
}

export const getUsers =
    async () => {

        const response =
            await api.get(
                "/users"
            );

        return response.data;
    };

export const updateUser =
    async (
        id: string,
        payload: UpdateUserPayload
    ) => {

        const response =
            await api.put(
                `/users/${id}`,
                payload
            );

        return response.data;
    };

export const deleteUser =
    async (
        id: string
    ) => {

        const response =
            await api.delete(
                `/users/${id}`
            );

        return response.data;
    };

export const updateSkills =
    async (
        id: string,
        skills: string[]
    ) => {

        const response =
            await api.patch(
                `/users/${id}/skills`,
                {
                    skills
                }
            );

        return response.data;
    };

export const updateAvailability =
    async (
        id: string,
        availableHoursPerDay: number,
        workingDays: string[]
    ) => {

        const response =
            await api.patch(
                `/users/${id}/availability`,
                {
                    availableHoursPerDay,
                    workingDays
                }
            );

        return response.data;
    };
