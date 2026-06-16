import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";



export default function AdminRoute({
    children
}: {
    children: ReactNode;
}) {

    const {
        user,
        loading
    } = useAuth();

    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/dashboard" />;
    }

    return children;
}