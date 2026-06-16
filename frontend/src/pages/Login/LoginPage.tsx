import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    loginUser,
    registerUser
} from "../../services/auth.service";

interface AuthFormData {
    name?: string;
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [mode, setMode] =
        useState<"login" | "register">(
            "login"
        );

    const [submitting, setSubmitting] =
        useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AuthFormData>();

    const onSubmit = async (data: AuthFormData) => {
        try {

            setSubmitting(true);

            if (mode === "register") {
                await registerUser(
                    data.name || "",
                    data.email,
                    data.password
                );

                setMode("login");
                reset({
                    email: data.email,
                    password: ""
                });
                alert("Registration successful. Please login.");
                return;
            }

            const response = await loginUser(
                data.email,
                data.password
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            setUser(response.data.user); 

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            alert(
                mode === "register"
                    ? "Registration failed"
                    : "Invalid credentials"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="panel auth-card">
                <h1>
                    {mode === "login"
                        ? "Login"
                        : "Register"}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {mode === "register" && (
                        <div className="form-field">
                            <label>Name</label>
                            <input
                                placeholder="Your name"
                                {...register(
                                    "name",
                                    {
                                        required:
                                            "Name is required"
                                    }
                                )}
                            />
                            <p className="form-error">
                                {errors.name?.message}
                            </p>
                        </div>
                    )}

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            placeholder="Email"
                            {...register(
                                "email",
                                {
                                    required:
                                        "Email is required"
                                }
                            )}
                        />
                        <p className="form-error">
                            {errors.email?.message}
                        </p>
                    </div>

                    <div className="form-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register(
                                "password",
                                {
                                    required:
                                        "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters"
                                    }
                                }
                            )}
                        />
                        <p className="form-error">
                            {errors.password?.message}
                        </p>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Please wait..."
                                : mode === "login"
                                    ? "Login"
                                    : "Register"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                setMode(
                                    mode === "login"
                                        ? "register"
                                        : "login"
                                )
                            }
                        >
                            {mode === "login"
                                ? "Create Account"
                                : "Back To Login"}
                        </button>
                    </div>
                </form>

                <button
                    type="button"
                    className="ghost-button"
                    style={{
                        width: "100%",
                        marginTop: "18px"
                    }}
                    onClick={() =>
                        navigate("/analytics")
                    }
                >
                    View Analytics
                </button>
            </div>
        </div>
    );
}
