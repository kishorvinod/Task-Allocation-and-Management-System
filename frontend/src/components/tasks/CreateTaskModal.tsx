import {
    useEffect,
    useState
} from "react";
import type React from "react";
import { useForm } from "react-hook-form";

import {
    createTask,
    updateTask,
    CreateTaskPayload,
    UpdateTaskPayload
} from "../../services/task.service";

interface TaskFormValues extends CreateTaskPayload {
    status?: "Pending" | "In Progress" | "Completed";
}

interface EditableTask {
    _id: string;
    title: string;
    description?: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    requiredSkill: string;
    estimatedHours: number;
    dueDate?: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    task?: EditableTask | null;
}

export default function CreateTaskModal({
    isOpen,
    onClose,
    onSuccess,
    task
}: CreateTaskModalProps) {

    const isEditing =
        Boolean(task);

    const [submitting, setSubmitting] =
        useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TaskFormValues>({
        defaultValues: {
            priority: "Medium"
        }
    });

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        if (task) {
            reset({
                title: task.title,
                description:
                    task.description || "",
                priority: task.priority,
                status: task.status,
                estimatedHours:
                    task.estimatedHours,
                requiredSkill:
                    task.requiredSkill,
                dueDate:
                    formatDateInput(
                        task.dueDate
                    )
            });
            return;
        }

        reset({
            priority: "Medium"
        });

    }, [
        isOpen,
        reset,
        task
    ]);

    const onSubmit = async (
        data: TaskFormValues
    ) => {

        try {

            setSubmitting(true);

            if (task) {
                const payload:
                    UpdateTaskPayload = {
                        title: data.title,
                        description:
                            data.description,
                        priority:
                            data.priority,
                        status:
                            data.status,
                        estimatedHours:
                            data.estimatedHours,
                        requiredSkill:
                            data.requiredSkill,
                        dueDate:
                            data.dueDate
                    };

                await updateTask(
                    task._id,
                    payload
                );
            } else {
                await createTask(data);
            }

            reset({
                priority: "Medium"
            });

            onSuccess();
            onClose();

        } catch (error) {

            console.error(error);
            alert(
                isEditing
                    ? "Failed to update task"
                    : "Failed to create task"
            );

        } finally {

            setSubmitting(false);

        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    {isEditing
                        ? "Update Task"
                        : "Create Task"}
                </h2>

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                >
                    <Field label="Title">
                        <input
                            {...register(
                                "title",
                                {
                                    required:
                                        "Title is required"
                                }
                            )}
                        />
                        <ErrorText message={errors.title?.message} />
                    </Field>

                    <Field label="Description">
                        <textarea
                            rows={3}
                            {...register(
                                "description"
                            )}
                        />
                    </Field>

                    <Field label="Priority">
                        <select
                            {...register(
                                "priority",
                                {
                                    required:
                                        "Priority is required"
                                }
                            )}
                        >
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
                    </Field>

                    {isEditing && (
                        <Field label="Status">
                            <select
                                {...register(
                                    "status",
                                    {
                                        required:
                                            "Status is required"
                                    }
                                )}
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
                        </Field>
                    )}

                    <Field label="Estimated Hours">
                        <input
                            type="number"
                            min={1}
                            {...register(
                                "estimatedHours",
                                {
                                    required:
                                        "Estimated hours is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 1,
                                        message:
                                            "Hours must be greater than 0"
                                    }
                                }
                            )}
                        />
                        <ErrorText
                            message={
                                errors.estimatedHours?.message
                            }
                        />
                    </Field>

                    <Field label="Required Skill">
                        <input
                            {...register(
                                "requiredSkill",
                                {
                                    required:
                                        "Required skill is required"
                                }
                            )}
                        />
                        <ErrorText
                            message={
                                errors.requiredSkill?.message
                            }
                        />
                    </Field>

                    <Field label="Due Date">
                        <input
                            type="date"
                            {...register(
                                "dueDate",
                                {
                                    required:
                                        "Due date is required"
                                }
                            )}
                        />
                        <ErrorText message={errors.dueDate?.message} />
                    </Field>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? isEditing
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditing
                                    ? "Update"
                                    : "Create"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatDateInput(
    value?: string
) {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
}

function Field({
    label,
    children
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="form-field">
            <label>
                {label}
            </label>
            {children}
        </div>
    );
}

function ErrorText({
    message
}: {
    message?: string;
}) {
    if (!message) {
        return null;
    }

    return (
        <p className="form-error">
            {message}
        </p>
    );
}
