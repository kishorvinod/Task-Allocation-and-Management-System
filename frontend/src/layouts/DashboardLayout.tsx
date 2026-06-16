import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children
}: DashboardLayoutProps) {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/");
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh"
            }}
        >
            <aside
                style={{
                    width: "250px",
                    background: "#f5f5f5",
                    padding: "20px",
                    borderRight: "1px solid #ddd"
                }}
            >
                <h2>
                    Task Manager
                </h2>

                <hr />

                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px"
                    }}
                >
                    <p>
                        <strong>
                            {user?.name}
                        </strong>
                    </p>

                    <p>
                        {user?.role}
                    </p>
                </div>

                <nav>
                    <ul
                        style={{
                            listStyle: "none",
                            padding: 0
                        }}
                    >
                        <li
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            <Link to="/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        {user?.role === "admin" && (
                            <>
                                <li
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                >
                                    <Link to="/users">
                                        Users
                                    </Link>
                                </li>

                                <li
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                >
                                    <Link to="/tasks">
                                        Tasks
                                    </Link>
                                </li>
                            </>
                        )}

                        {user?.role === "user" && (
                            <li>
                                <Link to="/tasks">
                                    My Tasks
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: "30px",
                        padding: "10px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: "30px"
                }}
            >
                {children}
            </main>
        </div>
    );
}