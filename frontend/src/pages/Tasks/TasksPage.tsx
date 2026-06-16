import {
    useCallback,
    useEffect,
    useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import { useAuth } from "../../context/AuthContext";

import {
    getTasks,
    deleteTask,
    assignTask,
    updateTaskStatus,
    TaskStatus
} from "../../services/task.service";

import {
    getUsers
} from "../../services/user.service";

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    requiredSkill: string;
    estimatedHours: number;

    assignedUser?: {
        _id: string;
        name: string;
        email?: string;
    };
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function TasksPage() {

    const { user } = useAuth();

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [users, setUsers] =
        useState<User[]>([]);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const loadTasks =
        useCallback(async () => {

            try {

                setLoading(true);

                const response =
                    await getTasks(
                        page,
                        search,
                        status,
                        priority
                    );

                setTasks(
                    response.data.tasks
                );

                setTotalPages(
                    response.data.totalPages
                );

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        }, [
            page,
            search,
            status,
            priority
        ]);

    const loadUsers =
        useCallback(async () => {

            try {

                const response =
                    await getUsers();

                setUsers(
                    response.data
                );

            } catch (error) {

                console.error(error);

            }
        }, []);

    useEffect(() => {

        loadTasks();

    }, [loadTasks]);

    useEffect(() => {

        if (user?.role === "admin") {
            loadUsers();
        }

    }, [
        loadUsers,
        user?.role
    ]);

    const handleAssign =
        async (
            task: Task
        ) => {

            const userList =
                users
                    .map(
                        item =>
                            `${item.name} (${item.email}) - ${item._id}`
                    )
                    .join("\n");

            const userId =
                window.prompt(
                    `Enter user id to assign:\n\n${userList}`
                );

            if (!userId) {
                return;
            }

            try {

                await assignTask(
                    task._id,
                    userId.trim()
                );

                loadTasks();

            } catch (error) {

                console.error(error);
                alert("Failed to assign task");

            }
        };

    const handleStatusUpdate =
        async (
            task: Task
        ) => {

            const status =
                window.prompt(
                    "Enter status: Pending, In Progress, Completed",
                    task.status
                ) as TaskStatus | null;

            if (!status) {
                return;
            }

            if (
                ![
                    "Pending",
                    "In Progress",
                    "Completed"
                ].includes(status)
            ) {
                alert("Invalid status");
                return;
            }

            try {

                await updateTaskStatus(
                    task._id,
                    status
                );

                loadTasks();

            } catch (error) {

                console.error(error);
                alert("Failed to update status");

            }
        };

    const handleDelete =
        async (
            id: string
        ) => {

            const confirmDelete =
                window.confirm(
                    "Delete task?"
                );

            if (!confirmDelete)
                return;

            await deleteTask(id);

            loadTasks();
        };

    return (
        <DashboardLayout>

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center"
                }}
            >
                <h1>
                    Tasks
                </h1>

                {user?.role === "admin" && (
                    <button
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                    >
                        Create Task
                    </button>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px"
                }}
            >

                <input
                    placeholder="Search tasks"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="In Progress">
                        In Progress
                    </option>

                    <option value="Completed">
                        Completed
                    </option>
                </select>

                <select
                    value={priority}
                    onChange={(e) =>
                        setPriority(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Priority
                    </option>

                    <option value="Low">
                        Low
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="High">
                        High
                    </option>
                </select>

            </div>

            {loading ? (

                <h3>
                    Loading...
                </h3>

            ) : (

                <>
                    <table
                        style={{
                            width:
                                "100%",
                            marginTop:
                                "20px",
                            borderCollapse:
                                "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={header}>
                                    Title
                                </th>

                                <th style={header}>
                                    Priority
                                </th>

                                <th style={header}>
                                    Status
                                </th>

                                <th style={header}>
                                    Skill
                                </th>

                                <th style={header}>
                                    Hours
                                </th>

                                <th style={header}>
                                    Assigned
                                </th>

                                <th style={header}>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {tasks.map(
                                (
                                    task
                                ) => (

                                    <tr
                                        key={
                                            task._id
                                        }
                                    >

                                        <td style={cell}>
                                            {
                                                task.title
                                            }
                                        </td>

                                        <td style={cell}>
                                            {
                                                task.priority
                                            }
                                        </td>

                                        <td style={cell}>
                                            {
                                                task.status
                                            }
                                        </td>

                                        <td style={cell}>
                                            {
                                                task.requiredSkill
                                            }
                                        </td>

                                        <td style={cell}>
                                            {
                                                task.estimatedHours
                                            }
                                        </td>

                                        <td style={cell}>
                                            {
                                                task
                                                    .assignedUser
                                                    ?.name ||
                                                "-"
                                            }
                                        </td>

                                        <td style={cell}>

                                            {user?.role === "admin" && (
                                                <button
                                                    onClick={() =>
                                                        handleAssign(
                                                            task
                                                        )
                                                    }
                                                >
                                                    Assign
                                                </button>
                                            )}

                                            <button
                                                style={{
                                                    marginLeft:
                                                        user?.role ===
                                                            "admin"
                                                            ? "10px"
                                                            : 0
                                                }}
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        task
                                                    )
                                                }
                                            >
                                                Status
                                            </button>

                                            {user?.role === "admin" && (
                                                <button
                                                    style={{
                                                        marginLeft:
                                                            "10px"
                                                    }}
                                                    onClick={() =>
                                                        handleDelete(
                                                            task._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                    <div
                        style={{
                            marginTop:
                                "20px"
                        }}
                    >

                        <button
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    (
                                        prev
                                    ) =>
                                        prev -
                                        1
                                )
                            }
                        >
                            Previous
                        </button>

                        <span
                            style={{
                                margin:
                                    "0 10px"
                            }}
                        >
                            Page {page}
                        </span>

                        <button
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (
                                        prev
                                    ) =>
                                        prev +
                                        1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>

                </>
            )}

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() =>
                    setShowCreateModal(false)
                }
                onSuccess={loadTasks}
            />

        </DashboardLayout>
    );
}

const header = {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#f5f5f5"
};

const cell = {
    border: "1px solid #ddd",
    padding: "10px"
};
