import api from "../api/axios";

export const getDashboardStats =
    async () => {

        const response =
            await api.get(
                "/dashboard"
            );

        return response.data;
    };

export const getWorkload =
    async () => {

        const response =
            await api.get(
                "/dashboard/workload"
            );

        return response.data;
    };