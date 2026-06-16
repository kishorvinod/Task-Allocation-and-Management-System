import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getDashboardStats,
    getWorkload
} from "../../services/dashboard.service";

interface DashboardStats {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalUsers: number;
}

interface WorkloadUser {
    userId: string;
    name: string;
    email: string;
    availableHours: number;
    allocatedHours: number;
    remainingHours: number;
    taskCount: number;
}

export default function DashboardPage() {

    const [stats, setStats] =
        useState<DashboardStats | null>(
            null
        );

    const [workload, setWorkload] =
        useState<WorkloadUser[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const fetchDashboardData =
        async () => {

            try {

                const statsResponse =
                    await getDashboardStats();

                const workloadResponse =
                    await getWorkload();

                setStats(
                    statsResponse.data
                );

                setWorkload(
                    workloadResponse.data
                );

            } catch (error) {

                console.error(
                    "Dashboard Error",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

    if (loading) {

        return (
            <DashboardLayout>
                <h2>
                    Loading Dashboard...
                </h2>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <h1>
                Dashboard
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >
                <StatCard
                    title="Total Tasks"
                    value={
                        stats?.totalTasks || 0
                    }
                />

                <StatCard
                    title="Pending Tasks"
                    value={
                        stats?.pendingTasks || 0
                    }
                />

                <StatCard
                    title="In Progress"
                    value={
                        stats?.inProgressTasks || 0
                    }
                />

                <StatCard
                    title="Completed"
                    value={
                        stats?.completedTasks || 0
                    }
                />

                <StatCard
                    title="Users"
                    value={
                        stats?.totalUsers || 0
                    }
                />
            </div>

            <div
                style={{
                    marginTop: "50px"
                }}
            >
                <h2>
                    Team Workload
                </h2>

                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                        marginTop: "20px"
                    }}
                >
                    <thead>
                        <tr>
                            <th style={tableHeader}>
                                Name
                            </th>

                            <th style={tableHeader}>
                                Available Hours
                            </th>

                            <th style={tableHeader}>
                                Allocated Hours
                            </th>

                            <th style={tableHeader}>
                                Remaining Hours
                            </th>

                            <th style={tableHeader}>
                                Tasks
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {workload.map(
                            (user) => (
                                <tr
                                    key={
                                        user.userId
                                    }
                                >
                                    <td
                                        style={
                                            tableCell
                                        }
                                    >
                                        {
                                            user.name
                                        }
                                    </td>

                                    <td
                                        style={
                                            tableCell
                                        }
                                    >
                                        {
                                            user.availableHours
                                        }
                                    </td>

                                    <td
                                        style={
                                            tableCell
                                        }
                                    >
                                        {
                                            user.allocatedHours
                                        }
                                    </td>

                                    <td
                                        style={
                                            tableCell
                                        }
                                    >
                                        {
                                            user.remainingHours
                                        }
                                    </td>

                                    <td
                                        style={
                                            tableCell
                                        }
                                    >
                                        {
                                            user.taskCount
                                        }
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

        </DashboardLayout>
    );
}

function StatCard({
    title,
    value
}: {
    title: string;
    value: number;
}) {

    return (
        <div
            style={{
                border:
                    "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                background: "#fff"
            }}
        >
            <h3>
                {title}
            </h3>

            <h1>
                {value}
            </h1>
        </div>
    );
}

const tableHeader: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#f5f5f5"
};

const tableCell: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "10px"
};