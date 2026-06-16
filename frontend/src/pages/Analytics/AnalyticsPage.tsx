import {
    useEffect,
    useState
} from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";

import {
    getAnalyticsOverview
} from "../../services/analytics.service";

interface WorkloadItem {
    userId: string;
    name: string;
    availableHours: number;
    allocatedHours: number;
    remainingHours: number;
    taskCount: number;
    utilization?: number;
}

interface RiskTask {
    taskId: string;
    title: string;
    status: string;
    dueDate: string;
    daysRemaining: number;
}

interface SkillDemand {
    skill: string;
    users: number;
    tasks: number;
}

interface CompletionSummary {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completionRate: number;
}

interface GroupMetric {
    _id: string;
    tasks?: number;
    estimatedHours?: number;
    hours?: number;
}

interface AnalyticsOverview {
    workload: WorkloadItem[];
    overloaded: WorkloadItem[];
    underutilized: WorkloadItem[];
    risks: RiskTask[];
    skills: SkillDemand[];
    completion: CompletionSummary;
    priority: GroupMetric[];
    hoursByStatus: GroupMetric[];
}

export default function AnalyticsPage() {

    const navigate = useNavigate();

    const [data, setData] =
        useState<AnalyticsOverview | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics =
        async () => {

            try {

                setLoading(true);
                setError("");

                const result =
                    await getAnalyticsOverview();

                setData(result);

            } catch (err) {

                console.error(err);
                setError(
                    "Unable to load analytics. Make sure the Python analytics service is running on port 8000."
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <div className="main-content analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Analytics
                    </h1>
                    <p className="muted">
                        Workforce, delivery risk, and task progress reports.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back To Login
                </button>
            </div>

            {loading && (
                <div className="panel">
                    Loading analytics...
                </div>
            )}

            {error && (
                <div className="panel">
                    <p className="form-error">
                        {error}
                    </p>
                    <button onClick={loadAnalytics}>
                        Retry
                    </button>
                </div>
            )}

            {data && !loading && !error && (
                <>
                    <div className="metric-grid analytics-metrics">
                        <Metric
                            title="Total Tasks"
                            value={
                                data.completion
                                    .totalTasks
                            }
                        />
                        <Metric
                            title="Completion Rate"
                            value={`${data.completion.completionRate}%`}
                        />
                        <Metric
                            title="At Risk"
                            value={
                                data.risks.length
                            }
                        />
                        <Metric
                            title="Overloaded Users"
                            value={
                                data.overloaded
                                    .length
                            }
                        />
                        <Metric
                            title="Underutilized Users"
                            value={
                                data.underutilized
                                    .length
                            }
                        />
                    </div>

                    <div className="panel analytics-intro">
                        <h2>
                            Analytics Service Details
                        </h2>
                        <p className="muted">
                            This public report reads from the standalone FastAPI analytics service. It performs read-only analysis against the same MongoDB users and tasks collections used by the main backend.
                        </p>
                        <div className="tag-list">
                            <span className="tag">
                                FastAPI
                            </span>
                            <span className="tag">
                                PyMongo
                            </span>
                            <span className="tag">
                                MongoDB
                            </span>
                            <span className="tag">
                                Read-only analytics
                            </span>
                        </div>
                    </div>

                    <div className="analytics-grid">
                        <Panel
                            title="1. Workload Summary"
                            endpoint="/analytics/workload-summary"
                            purpose="Provides workload distribution across all users."
                            logic="Available hours = available hours per day x working days. Remaining hours = available hours - allocated task hours."
                            wide
                        >
                            <SimpleTable
                                headers={[
                                    "Name",
                                    "Available",
                                    "Allocated",
                                    "Remaining",
                                    "Tasks",
                                    "Utilization"
                                ]}
                                rows={data.workload.map(
                                    item => [
                                        item.name,
                                        item.availableHours,
                                        item.allocatedHours,
                                        item.remainingHours,
                                        item.taskCount,
                                        `${utilizationPercent(
                                            item
                                        )}%`
                                    ]
                                )}
                            />
                        </Panel>

                        <Panel
                            title="2. Overloaded Users"
                            endpoint="/analytics/overloaded-users"
                            purpose="Identifies users whose assigned workload exceeds available capacity."
                            logic="A user is overloaded when allocated hours are greater than available hours."
                            wide
                        >
                            <SimpleTable
                                headers={[
                                    "Name",
                                    "Available",
                                    "Allocated",
                                    "Over By",
                                    "Tasks"
                                ]}
                                rows={data.overloaded.map(
                                    item => [
                                        item.name,
                                        item.availableHours,
                                        item.allocatedHours,
                                        item.allocatedHours -
                                            item.availableHours,
                                        item.taskCount
                                    ]
                                )}
                                emptyText="No overloaded users."
                            />
                        </Panel>

                        <Panel
                            title="3. Underutilized Users"
                            endpoint="/analytics/underutilized-users"
                            purpose="Identifies users who are significantly underutilized."
                            logic="Utilization = allocated hours / available hours x 100. Users below 50% are underutilized."
                            wide
                        >
                            <SimpleTable
                                headers={[
                                    "Name",
                                    "Available",
                                    "Allocated",
                                    "Remaining",
                                    "Utilization"
                                ]}
                                rows={data.underutilized.map(
                                    item => [
                                        item.name,
                                        item.availableHours,
                                        item.allocatedHours,
                                        item.remainingHours,
                                        `${item.utilization ??
                                            utilizationPercent(
                                                item
                                            )}%`
                                    ]
                                )}
                                emptyText="No underutilized users."
                            />
                        </Panel>

                        <Panel
                            title="4. Tasks At Risk"
                            endpoint="/analytics/tasks-at-risk"
                            purpose="Identifies tasks likely to miss deadlines."
                            logic="A task is at risk when it is not completed and the due date is within the next 3 days."
                            wide
                        >
                            <SimpleTable
                                headers={[
                                    "Task",
                                    "Status",
                                    "Due Date",
                                    "Days Left"
                                ]}
                                rows={data.risks.map(
                                    item => [
                                        item.title,
                                        item.status,
                                        formatDate(
                                            item.dueDate
                                        ),
                                        item.daysRemaining
                                    ]
                                )}
                                emptyText="No tasks are currently at risk."
                            />
                        </Panel>

                        <Panel
                            title="5. Skill Demand Summary"
                            endpoint="/analytics/skill-demand"
                            purpose="Shows skill demand versus skill availability for workforce planning and skill gap detection."
                            logic="For each required skill, compare the number of users having that skill with the number of tasks requiring it."
                        >
                            <SimpleTable
                                headers={[
                                    "Skill",
                                    "Users",
                                    "Tasks",
                                    "Gap"
                                ]}
                                rows={data.skills.map(
                                    item => [
                                        item.skill,
                                        item.users,
                                        item.tasks,
                                        item.tasks -
                                            item.users
                                    ]
                                )}
                            />
                        </Panel>

                        <Panel
                            title="6. Task Completion Summary"
                            endpoint="/analytics/task-completion-summary"
                            purpose="Provides overall project progress statistics."
                            logic="Completion rate = completed tasks / total tasks x 100."
                        >
                            <ProgressBar
                                label="Completed"
                                value={
                                    data.completion
                                        .completionRate
                                }
                            />
                            <SmallStats
                                items={[
                                    [
                                        "Pending",
                                        data
                                            .completion
                                            .pendingTasks
                                    ],
                                    [
                                        "In Progress",
                                        data
                                            .completion
                                            .inProgressTasks
                                    ],
                                    [
                                        "Completed",
                                        data
                                            .completion
                                            .completedTasks
                                    ]
                                ]}
                            />
                        </Panel>

                        <Panel
                            title="7. Priority Wise Workload"
                            endpoint="/analytics/priority-workload"
                            purpose="Analyzes effort distribution by task priority level."
                            logic="Tasks are grouped by priority, then task count and total estimated hours are calculated."
                        >
                            <SimpleTable
                                headers={[
                                    "Priority",
                                    "Tasks",
                                    "Hours"
                                ]}
                                rows={data.priority.map(
                                    item => [
                                        item._id,
                                        item.tasks || 0,
                                        item.estimatedHours ||
                                            0
                                    ]
                                )}
                            />
                        </Panel>

                        <Panel
                            title="8. Estimated Hours By Status"
                            endpoint="/analytics/hours-by-status"
                            purpose="Shows effort distribution across task lifecycle stages."
                            logic="Tasks are grouped by Pending, In Progress, and Completed, then estimated hours are summed."
                        >
                            {data.hoursByStatus.map(
                                item => (
                                    <ProgressBar
                                        key={item._id}
                                        label={item._id}
                                        value={
                                            item.hours || 0
                                        }
                                        max={maxValue(
                                            data.hoursByStatus,
                                            "hours"
                                        )}
                                    />
                                )
                            )}
                            <SimpleTable
                                headers={[
                                    "Status",
                                    "Estimated Hours"
                                ]}
                                rows={data.hoursByStatus.map(
                                    item => [
                                        item._id,
                                        item.hours || 0
                                    ]
                                )}
                            />
                        </Panel>
                    </div>

                    <div className="panel analytics-assumptions">
                        <h2>
                            Analytics Assumptions
                        </h2>
                        <div className="tag-list">
                            <span className="tag">
                                MongoDB is the source of truth
                            </span>
                            <span className="tag">
                                Estimated hours represent workload effort
                            </span>
                            <span className="tag">
                                Capacity comes from daily hours and working days
                            </span>
                            <span className="tag">
                                Underutilized means utilization below 50%
                            </span>
                            <span className="tag">
                                At-risk means due within 3 days and not completed
                            </span>
                            <span className="tag">
                                Each task has one primary skill
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Metric({
    title,
    value
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div className="metric-card">
            <h3>{title}</h3>
            <strong>{value}</strong>
        </div>
    );
}

function Panel({
    title,
    endpoint,
    purpose,
    logic,
    wide = false,
    children
}: {
    title: string;
    endpoint?: string;
    purpose?: string;
    logic?: string;
    wide?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`panel analytics-panel${wide
                ? " analytics-panel-wide"
                : ""}`}
        >
            <div className="analytics-panel-header">
                <h2>{title}</h2>
                {endpoint && (
                    <span className="tag analytics-endpoint">
                        GET {endpoint}
                    </span>
                )}
            </div>
            {purpose && (
                <p>
                    {purpose}
                </p>
            )}
            {logic && (
                <p className="muted">
                    {logic}
                </p>
            )}
            {children}
        </div>
    );
}

function ProgressBar({
    label,
    value,
    max = 100
}: {
    label: string;
    value: number;
    max?: number;
}) {

    const percent =
        max > 0
            ? Math.min(
                  100,
                  Math.round(
                      (value / max) * 100
                  )
              )
            : 0;

    return (
        <div
            style={{
                marginBottom: "14px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    marginBottom: "6px"
                }}
            >
                <strong>{label}</strong>
                <span className="muted">
                    {value}
                </span>
            </div>
            <div className="bar-track">
                <div
                    className="bar-fill"
                    style={{
                        width: `${percent}%`
                    }}
                />
            </div>
        </div>
    );
}

function SmallStats({
    items
}: {
    items: Array<[string, number]>;
}) {
    return (
        <div className="tag-list">
            {items.map(
                ([label, value]) => (
                    <span
                        className="tag"
                        key={label}
                    >
                        {label}: {value}
                    </span>
                )
            )}
        </div>
    );
}

function SimpleTable({
    headers,
    rows,
    emptyText = "No data available."
}: {
    headers: string[];
    rows: Array<Array<string | number>>;
    emptyText?: string;
}) {
    if (rows.length === 0) {
        return (
            <p className="muted">
                {emptyText}
            </p>
        );
    }

    return (
        <table className="data-table analytics-table">
            <thead>
                <tr>
                    {headers.map(
                        header => (
                            <th key={header}>
                                {header}
                            </th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {rows.map(
                    (row, index) => (
                        <tr key={index}>
                            {row.map(
                                (
                                    cell,
                                    cellIndex
                                ) => (
                                    <td
                                        key={
                                            cellIndex
                                        }
                                    >
                                        {cell}
                                    </td>
                                )
                            )}
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

function maxValue(
    items: GroupMetric[],
    key: "hours" | "estimatedHours"
) {
    return Math.max(
        1,
        ...items.map(
            item => item[key] || 0
        )
    );
}

function formatDate(value: string) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString();
}

function utilizationPercent(
    item: WorkloadItem
) {
    if (!item.availableHours) {
        return 0;
    }

    return Math.round(
        (item.allocatedHours /
            item.availableHours) *
            100
    );
}
