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
    TaskPriority,
    TaskStatus
} from "../../services/task.service";

import {
    getUsers
} from "../../services/user.service";

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    requiredSkill: string;
    estimatedHours: number;
    dueDate?: string;

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
    role: string;
}

interface PendingTaskChange {
    status?: TaskStatus;
    assignedUserId?: string;
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

    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);

    const [pendingChanges, setPendingChanges] =
        useState<Record<string, PendingTaskChange>>(
            {}
        );

    const assignableUsers =
        users.filter(
            item =>
                item.role !== "admin"
        );

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

                setPendingChanges({});

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

    const setPendingValue =
        (
            task: Task,
            change: PendingTaskChange
        ) => {

            setPendingChanges(
                current => {

                    const nextChange = {
                        ...(current[task._id] ||
                            {}),
                        ...change
                    };

                    if (
                        nextChange.status ===
                        task.status
                    ) {
                        delete nextChange.status;
                    }

                    if (
                        nextChange.assignedUserId ===
                        (
                            task.assignedUser?._id ||
                            ""
                        )
                    ) {
                        delete nextChange.assignedUserId;
                    }

                    const next = {
                        ...current
                    };

                    if (
                        nextChange.status ||
                        nextChange.assignedUserId
                    ) {
                        next[task._id] =
                            nextChange;
                    } else {
                        delete next[task._id];
                    }

                    return next;
                }
            );

        };

    const saveTaskChanges =
        async (
            task: Task
        ) => {

            const changes =
                pendingChanges[task._id];

            if (!changes) {
                return;
            }

            try {

                if (changes.assignedUserId) {
                    await assignTask(
                        task._id,
                        changes.assignedUserId
                    );
                }

                if (changes.status) {
                    await updateTaskStatus(
                        task._id,
                        changes.status
                    );
                }

                loadTasks();

            } catch (error) {

                console.error(error);
                alert("Failed to save task changes");

            }
        };

    const handleCloseModal =
        () => {

            setShowCreateModal(false);
            setSelectedTask(null);

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

            <div className="page-header">
                <h1 className="page-title">
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

            <div className="panel">
            <div className="toolbar">

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
                    <div className="table-wrap">
                    <table className="data-table">

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
                                            <select
                                                value={
                                                    pendingChanges[
                                                        task
                                                            ._id
                                                    ]?.status ||
                                                    task.status
                                                }
                                                onChange={(event) =>
                                                    setPendingValue(
                                                        task,
                                                        {
                                                            status:
                                                                event
                                                                    .target
                                                                    .value as TaskStatus
                                                        }
                                                    )
                                                }
                                            >
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
                                            {user?.role === "admin" ? (
                                                <select
                                                    value={
                                                        pendingChanges[
                                                            task
                                                                ._id
                                                        ]?.assignedUserId ??
                                                        task
                                                            .assignedUser
                                                            ?._id ??
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        setPendingValue(
                                                            task,
                                                            {
                                                                assignedUserId:
                                                                    event
                                                                        .target
                                                                        .value
                                                            }
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select user
                                                    </option>

                                                    {assignableUsers.map(
                                                        (
                                                            item
                                                        ) => (
                                                            <option
                                                                key={
                                                                    item._id
                                                                }
                                                                value={
                                                                    item._id
                                                                }
                                                            >
                                                                {item.name} ({item.email})
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            ) : (
                                                task
                                                    .assignedUser
                                                    ?.name ||
                                                "-"
                                            )}
                                        </td>

                                        <td style={cell}>
                                            <div className="action-row">

                                            {user?.role === "admin" && (
                                                <button
                                                    onClick={() =>
                                                        setSelectedTask(
                                                            task
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            {pendingChanges[
                                                task._id
                                            ] && (
                                                <button
                                                    onClick={() =>
                                                        saveTaskChanges(
                                                            task
                                                        )
                                                    }
                                                >
                                                    Save Changes
                                                </button>
                                            )}

                                            {user?.role === "admin" && (
                                                <button
                                                    className="danger-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            task._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>
                    </div>

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
            </div>

            <CreateTaskModal
                isOpen={
                    showCreateModal ||
                    Boolean(selectedTask)
                }
                onClose={handleCloseModal}
                onSuccess={loadTasks}
                task={selectedTask}
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
