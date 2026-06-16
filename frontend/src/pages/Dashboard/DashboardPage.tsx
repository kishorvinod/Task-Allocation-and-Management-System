import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({
    children
}: {
    children?: React.ReactNode;
}) {

    const {
        user,
        logout
    } = useAuth();

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
                    padding: "20px",
                    borderRight:
                        "1px solid #ddd"
                }}
            >
                <h2>
                    Task Manager
                </h2>

                <p>
                    {user?.name}
                </p>

                <nav>
                    <ul>
                        <li>
                            <Link
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/users"
                            >
                                Users
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/tasks"
                            >
                                Tasks
                            </Link>
                        </li>
                    </ul>
                </nav>

                <button
                    onClick={
                        logout
                    }
                >
                    Logout
                </button>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: "20px"
                }}
            >
                {children}
            </main>
        </div>
    );
}