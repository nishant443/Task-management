import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // your backend URL
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("user"); // we store full user object
    if (raw) {
        const user = JSON.parse(raw);
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
});

export default api;

// -------------------------
// Admin API Helpers
// -------------------------

// Ban a user
export const banUser = async (userId) => {
    const res = await api.put(`/auth/ban/${userId}`);
    return res.data;
};

// Unban a user
export const unbanUser = async (userId) => {
    const res = await api.put(`/auth/unban/${userId}`);
    return res.data;
};
export const getAllUsers = async () => (await api.get("/auth/users")).data.users;
export const deleteTask = async (taskId) => (await api.delete(`/tasks/${taskId}`)).data;
export const updateTask = async (taskId, data) => (await api.put(`/tasks/${taskId}`, data)).data;
