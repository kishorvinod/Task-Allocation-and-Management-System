import axios from "axios";

const analyticsApi = axios.create({
    baseURL:
        process.env.REACT_APP_ANALYTICS_URL ||
        "http://localhost:8000"
});

export const getAnalyticsOverview =
    async () => {

        const [
            workload,
            overloaded,
            underutilized,
            risks,
            skills,
            completion,
            priority,
            hoursByStatus
        ] = await Promise.all([
            analyticsApi.get(
                "/analytics/workload-summary"
            ),
            analyticsApi.get(
                "/analytics/overloaded-users"
            ),
            analyticsApi.get(
                "/analytics/underutilized-users"
            ),
            analyticsApi.get(
                "/analytics/tasks-at-risk"
            ),
            analyticsApi.get(
                "/analytics/skill-demand"
            ),
            analyticsApi.get(
                "/analytics/task-completion-summary"
            ),
            analyticsApi.get(
                "/analytics/priority-workload"
            ),
            analyticsApi.get(
                "/analytics/hours-by-status"
            )
        ]);

        return {
            workload: workload.data,
            overloaded: overloaded.data,
            underutilized: underutilized.data,
            risks: risks.data,
            skills: skills.data,
            completion: completion.data,
            priority: priority.data,
            hoursByStatus: hoursByStatus.data
        };
    };

export const downloadCompletionSummaryExcel =
    async () => {

        const response =
            await analyticsApi.get(
                "/analytics/task-completion-summary/download",
                {
                    responseType: "blob"
                }
            );

        const filename =
            getFilenameFromHeader(
                response.headers[
                    "content-disposition"
                ]
            ) ||
            "task-completion-summary.xlsx";

        const blob = new Blob(
            [response.data],
            {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        const url =
            window.URL.createObjectURL(blob);
        const link =
            document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

function getFilenameFromHeader(
    header?: string
) {
    if (!header) {
        return "";
    }

    const match =
        header.match(/filename="?([^"]+)"?/);

    return match?.[1] || "";
}
