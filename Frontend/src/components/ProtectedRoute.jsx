import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, ready, isAdmin } = useContext(AuthContext);
    if (!ready) return null; // or loader

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <div className="p-6 bg-yellow-50 border rounded">You are not authorized to view this page.</div>;
    }

    return children;
}
