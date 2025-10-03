import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    // Load user from localStorage on app start
    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (raw) {
            setUser(JSON.parse(raw));
        }
        setReady(true);
    }, []);

    // Save user + token in one object
    const login = (userData, token) => {
        const fullUser = { ...userData, token }; // merge token into user object
        localStorage.setItem("user", JSON.stringify(fullUser));
        setUser(fullUser);
    };

    // Clear storage on logout
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    // Helper: check if user is admin
    const isAdmin = () => user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, ready, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}
