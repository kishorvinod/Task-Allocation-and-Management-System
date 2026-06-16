import { useState } from "react";
import type React from "react";
import { useForm } from "react-hook-form";

import {
    createTask,
    CreateTaskPayload
} from "../../services/task.service";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTaskModal({
    isOpen,
    onClose,
    onSuccess
}: CreateTaskModalProps) {

    const [submitting, setSubmitting] =
        useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateTaskPayload>({
        defaultValues: {
            priority: "Medium"
        }
    });

    const onSubmit = async (
        data: CreateTaskPayload
    ) => {

        try {

            setSubmitting(true);

            await createTask(data);

            reset({
                priority: "Medium"
            });

            onSuccess();
            onClose();

        } catch (error) {

            console.error(error);
            alert("Failed to create task");

        } finally {

            setSubmitting(false);

        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div style={overlay}>
            <div style={modal}>
                <h2>
                    Create Task
                </h2>

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                >
                    <Field label="Title">
                        <input
                            style={input}
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
                            style={input}
                            rows={3}
                            {...register(
                                "description"
                            )}
                        />
                    </Field>

                    <Field label="Priority">
                        <select
                            style={input}
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

                    <Field label="Estimated Hours">
                        <input
                            type="number"
                            min={1}
                            style={input}
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
                            style={input}
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
                            style={input}
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

                    <div style={actions}>
                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating..."
                                : "Create"}
                        </button>

                        <button
                            type="button"
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

function Field({
    label,
    children
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div style={field}>
            <label style={labelStyle}>
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
        <p style={errorText}>
            {message}
        </p>
    );
}

const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
};

const modal: React.CSSProperties = {
    background: "white",
    padding: "20px",
    width: "500px",
    maxWidth: "calc(100vw - 32px)",
    borderRadius: "8px"
};

const field: React.CSSProperties = {
    marginBottom: "14px"
};

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600
};

const input: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px"
};

const actions: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginTop: "18px"
};

const errorText: React.CSSProperties = {
    color: "crimson",
    margin: "4px 0 0",
    fontSize: "13px"
};
