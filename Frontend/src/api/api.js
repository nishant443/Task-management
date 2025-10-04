// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api",
// });

// // Automatically attach token if available
// api.interceptors.request.use((config) => {
//     const raw = localStorage.getItem("user"); // we store full user object
//     if (raw) {
//         const user = JSON.parse(raw);
//         if (user?.token) {
//             config.headers.Authorization = `Bearer ${user.token}`;
//         }
//     }
//     return config;
// });

// export default api;

// // -------------------------
// // Admin API Helpers
// // -------------------------

// // Ban a user
// export const banUser = async (userId) => {
//     const res = await api.put(`/auth/ban/${userId}`);
//     return res.data;
// };

// // Unban a user
// export const unbanUser = async (userId) => {
//     const res = await api.put(`/auth/unban/${userId}`);
//     return res.data;
// };
// export const getAllUsers = async () => (await api.get("/auth/users")).data.users;
// export const deleteTask = async (taskId) => (await api.delete(`/tasks/${taskId}`)).data;
// export const updateTask = async (taskId, data) => (await api.put(`/tasks/${taskId}`, data)).data;

import axios from "axios";

// ✅ Use environment variable for flexibility (local + deployed)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    // Optional: if you later use cookies/sessions
    // withCredentials: true,
});

// ✅ Automatically attach token if available
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("user"); // stored full user object
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
// ✅ Admin API Helpers
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

// Get all users
export const getAllUsers = async () => (await api.get("/auth/users")).data.users;

// Delete a task
export const deleteTask = async (taskId) => (await api.delete(`/tasks/${taskId}`)).data;

// Update a task
export const updateTask = async (taskId, data) =>
    (await api.put(`/tasks/${taskId}`, data)).data;
