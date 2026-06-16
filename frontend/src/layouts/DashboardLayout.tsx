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
        <div className="app-shell">
            <aside className="sidebar">
                <h2>
                    Task Allocation & Management System
                </h2>

                <hr />

                <div className="sidebar-user">
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
                    <ul>
                        <li>
                            <Link to="/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        {user?.role === "admin" && (
                            <>
                                <li>
                                    <Link to="/users">
                                        Users
                                    </Link>
                                </li>

                                <li>
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
                    className="logout-button"
                >
                    Logout
                </button>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
