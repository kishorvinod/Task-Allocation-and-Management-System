import {
    useCallback,
    useEffect,
    useState
} from "react";
import type React from "react";

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
        role?: string;
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

    const isAdmin =
        user?.role === "admin";

    const assignableUsers =
        users.filter(
            item =>
                item.role !== "admin"
        );

    const myTasks =
        tasks.filter(
            task =>
                task.assignedUser?._id ===
                user?._id
        );

    const allUserTasks =
        tasks.filter(
            task =>
                task.assignedUser &&
                task.assignedUser.role !== "admin"
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

        if (isAdmin) {
            loadUsers();
        }

    }, [
        isAdmin,
        loadUsers
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

            if (!confirmDelete) {
                return;
            }

            await deleteTask(id);

            loadTasks();
        };

    return (
        <DashboardLayout>

            <div className="page-header">
                <h1 className="page-title">
                    {isAdmin
                        ? "Tasks"
                        : "My Tasks"}
                </h1>

                {isAdmin && (
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
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value
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
                        onChange={(event) =>
                            setPriority(
                                event.target.value
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
                ) : isAdmin ? (
                    <TaskTable
                        tasks={tasks}
                        pendingChanges={
                            pendingChanges
                        }
                        assignableUsers={
                            assignableUsers
                        }
                        canAssign
                        canDelete
                        canEditDetails
                        canEditStatus
                        onPendingChange={
                            setPendingValue
                        }
                        onSave={
                            saveTaskChanges
                        }
                        onEdit={setSelectedTask}
                        onDelete={handleDelete}
                    />
                ) : (
                    <>
                        <TaskSection
                            title="My Tasks"
                            description="Tasks assigned to you. Status changes are saved only after clicking Save Changes."
                        >
                            <TaskTable
                                tasks={myTasks}
                                pendingChanges={
                                    pendingChanges
                                }
                                assignableUsers={[]}
                                canEditStatus
                                onPendingChange={
                                    setPendingValue
                                }
                                onSave={
                                    saveTaskChanges
                                }
                            />
                        </TaskSection>

                        <TaskSection
                            title="All User Tasks"
                            description="Read-only list of tasks assigned to non-admin users."
                        >
                            <TaskTable
                                tasks={allUserTasks}
                                pendingChanges={{}}
                                assignableUsers={[]}
                                readOnly
                            />
                        </TaskSection>
                    </>
                )}

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage(
                                prev => prev - 1
                            )
                        }
                    >
                        Previous
                    </button>

                    <span
                        style={{
                            margin: "0 10px"
                        }}
                    >
                        Page {page}
                    </span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() =>
                            setPage(
                                prev => prev + 1
                            )
                        }
                    >
                        Next
                    </button>
                </div>
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

function TaskSection({
    title,
    description,
    children
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                marginBottom: "28px"
            }}
        >
            <div className="section-heading">
                <div>
                    <h2>
                        {title}
                    </h2>
                    <p className="muted">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </div>
    );
}

function TaskTable({
    tasks,
    pendingChanges,
    assignableUsers,
    canAssign = false,
    canDelete = false,
    canEditDetails = false,
    canEditStatus = false,
    readOnly = false,
    onPendingChange,
    onSave,
    onEdit,
    onDelete
}: {
    tasks: Task[];
    pendingChanges: Record<string, PendingTaskChange>;
    assignableUsers: User[];
    canAssign?: boolean;
    canDelete?: boolean;
    canEditDetails?: boolean;
    canEditStatus?: boolean;
    readOnly?: boolean;
    onPendingChange?: (
        task: Task,
        change: PendingTaskChange
    ) => void;
    onSave?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (id: string) => void;
}) {
    if (tasks.length === 0) {
        return (
            <p className="muted">
                No tasks found.
            </p>
        );
    }

    const showActions =
        !readOnly &&
        (
            canEditDetails ||
            canDelete ||
            canEditStatus
        );

    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Skill</th>
                        <th>Hours</th>
                        <th>Assigned</th>
                        {showActions && (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {tasks.map(
                        task => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.priority}</td>
                                <td>
                                    {canEditStatus ? (
                                        <select
                                            value={
                                                pendingChanges[
                                                    task._id
                                                ]?.status ||
                                                task.status
                                            }
                                            onChange={(event) =>
                                                onPendingChange?.(
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
                                    ) : (
                                        task.status
                                    )}
                                </td>
                                <td>{task.requiredSkill}</td>
                                <td>{task.estimatedHours}</td>
                                <td>
                                    {canAssign ? (
                                        <select
                                            value={
                                                pendingChanges[
                                                    task._id
                                                ]?.assignedUserId ??
                                                task
                                                    .assignedUser
                                                    ?._id ??
                                                ""
                                            }
                                            onChange={(event) =>
                                                onPendingChange?.(
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
                                                item => (
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
                                        task.assignedUser
                                            ?.name || "-"
                                    )}
                                </td>
                                {showActions && (
                                    <td>
                                        <div className="action-row">
                                            {canEditDetails && (
                                                <button
                                                    onClick={() =>
                                                        onEdit?.(
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
                                                        onSave?.(
                                                            task
                                                        )
                                                    }
                                                >
                                                    Save Changes
                                                </button>
                                            )}

                                            {canDelete && (
                                                <button
                                                    className="danger-button"
                                                    onClick={() =>
                                                        onDelete?.(
                                                            task._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
