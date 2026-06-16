import api from "../api/axios";

export const getUsers =
    async () => {

        const response =
            await api.get(
                "/users"
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