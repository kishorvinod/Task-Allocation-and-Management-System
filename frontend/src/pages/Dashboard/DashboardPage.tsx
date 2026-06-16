import {
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
    getDashboardStats
} from "../../services/dashboard.service";

interface DashboardStats {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalUsers: number;
}

export default function DashboardPage() {

    const { user } = useAuth();

    const [stats, setStats] =
        useState<DashboardStats | null>(
            null
        );

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

                setStats(
                    statsResponse.data
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

    const skills =
        user?.skills || [];

    const workingDays =
        user?.workingDays || [];

    const weeklyCapacity =
        (user?.availableHoursPerDay || 0) *
        workingDays.length;

    return (
        <DashboardLayout>

            <div className="page-header">
                <h1 className="page-title">
                    Dashboard
                </h1>
            </div>

            <div className="panel">
                <h2>
                    My Details
                </h2>

                <div className="metric-grid">
                    <ProfileItem
                        label="Name"
                        value={user?.name || "-"}
                    />

                    <ProfileItem
                        label="Email"
                        value={user?.email || "-"}
                    />

                    <ProfileItem
                        label="Role"
                        value={user?.role || "-"}
                    />

                    <ProfileItem
                        label="Daily Hours"
                        value={
                            user?.availableHoursPerDay ||
                            0
                        }
                    />

                    <ProfileItem
                        label="Weekly Capacity"
                        value={weeklyCapacity}
                    />
                </div>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <h3>
                        Skills
                    </h3>

                    {skills.length > 0 ? (
                        <div className="tag-list">
                            {skills.map(
                                (
                                    skill: string
                                ) => (
                                    <span
                                        className="tag"
                                        key={skill}
                                    >
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="muted">
                            No skills added yet.
                        </p>
                    )}
                </div>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <h3>
                        Working Days
                    </h3>

                    {workingDays.length > 0 ? (
                        <div className="tag-list">
                            {workingDays.map(
                                (
                                    day: string
                                ) => (
                                    <span
                                        className="tag"
                                        key={day}
                                    >
                                        {day}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="muted">
                            Availability is not configured.
                        </p>
                    )}
                </div>
            </div>

            <div
                className="metric-grid"
                style={{
                    marginTop: "22px"
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

                {user?.role === "admin" && (
                    <StatCard
                        title="Users"
                        value={
                            stats?.totalUsers || 0
                        }
                    />
                )}
            </div>

        </DashboardLayout>
    );
}

function ProfileItem({
    label,
    value
}: {
    label: string;
    value: string | number;
}) {

    return (
        <div className="metric-card">
            <h3>
                {label}
            </h3>

            <p
                style={{
                    margin: 0,
                    fontWeight: 700
                }}
            >
                {value}
            </p>
        </div>
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
        <div className="metric-card">
            <h3>
                {title}
            </h3>

            <strong>
                {value}
            </strong>
        </div>
    );
}
