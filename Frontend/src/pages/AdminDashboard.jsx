import { useEffect, useState, useContext } from "react";
import api, { banUser, unbanUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    // ---------------------------
    // New admin form
    // ---------------------------
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [addingAdmin, setAddingAdmin] = useState(false);

    // ---------------------------
    // Fetch all tasks (admin)
    // ---------------------------
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tasks/admin/tasks");
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------
    // Fetch all users (admin)
    // ---------------------------
    const fetchUsers = async () => {
        try {
            const res = await api.get("/auth/users");
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    // ---------------------------
    // Delete Task
    // ---------------------------
    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert("Failed to delete task");
        }
    };

    // ---------------------------
    // Edit Task
    // ---------------------------
    const handleEdit = async (taskId) => {
        const newStatus = prompt("Enter new status (pending/in-progress/completed):");
        const newPriority = prompt("Enter new priority (low/medium/high):");
        if (!newStatus || !newPriority) return;

        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus, priority: newPriority });
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert("Failed to update task");
        }
    };

    // ---------------------------
    // Assign Task to User
    // ---------------------------
    const handleAssign = async (taskId, userId) => {
        try {
            await api.put(`/tasks/${taskId}`, { assignedTo: userId });
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert("Failed to assign task");
        }
    };

    // ---------------------------
    // Ban / Unban User
    // ---------------------------
    const handleBan = async (id) => {
        try {
            await banUser(id);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to ban user");
        }
    };

    const handleUnban = async (id) => {
        try {
            await unbanUser(id);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to unban user");
        }
    };

    // ---------------------------
    // Add New Admin
    // ---------------------------
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!newAdminName || !newAdminEmail || !newAdminPassword) return alert("All fields required");

        try {
            setAddingAdmin(true);
            const res = await api.post("/auth/register", {
                name: newAdminName,
                email: newAdminEmail,
                password: newAdminPassword,
                role: "admin",
            });
            alert("Admin added successfully!");
            setNewAdminName("");
            setNewAdminEmail("");
            setNewAdminPassword("");
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to add admin");
        } finally {
            setAddingAdmin(false);
        }
    };

    // ---------------------------
    // Filtered tasks
    // ---------------------------
    const filteredTasks = tasks.filter((task) => {
        return (
            (!statusFilter || task.status === statusFilter) &&
            (!priorityFilter || task.priority === priorityFilter)
        );
    });

    // ---------------------------
    // Stats
    // ---------------------------
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const teamMembers = new Set(tasks.map((t) => t.assignedTo || t.createdBy)).size;

    if (loading) return <div>Loading admin dashboard...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* ---------------- Stats ---------------- */}
            <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-100 rounded shadow">Total Tasks: {totalTasks}</div>
                <div className="p-4 bg-gray-100 rounded shadow">In Progress: {inProgressTasks}</div>
                <div className="p-4 bg-gray-100 rounded shadow">Completed: {completedTasks}</div>
                <div className="p-4 bg-gray-100 rounded shadow">Team Members: {teamMembers}</div>
            </div>

            {/* ---------------- Filters ---------------- */}
            <div className="flex space-x-4 mt-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {/* ---------------- Task Table ---------------- */}
            <table className="min-w-full border border-gray-300 mt-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Priority</th>
                        <th className="px-4 py-2 border">Created By</th>
                        <th className="px-4 py-2 border">Assigned To</th>
                        <th className="px-4 py-2 border">Due Date</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task._id} className="text-center">
                            <td className="px-4 py-2 border">{task.title}</td>
                            <td className="px-4 py-2 border">{task.status}</td>
                            <td className="px-4 py-2 border">{task.priority}</td>
                            <td className="px-4 py-2 border">{typeof task.createdBy === "object" ? task.createdBy.name : task.createdBy}</td>
                            <td className="px-4 py-2 border">
                                <select
                                    value={task.assignedTo || ""}
                                    onChange={(e) => handleAssign(task._id, e.target.value)}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value="">Unassigned</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id} disabled={u.banned}>
                                            {u.name} {u.banned ? "(BANNED)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-2 border">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                            <td className="px-4 py-2 border space-x-2">
                                <button onClick={() => handleEdit(task._id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ---------------- Users Table ---------------- */}
            <h2 className="text-xl font-bold mt-6">Users</h2>
            <table className="min-w-full border border-gray-300 mt-2">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Role</th>
                        <th className="px-4 py-2 border">Banned</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id} className="text-center">
                            <td className="px-4 py-2 border">{u.name}</td>
                            <td className="px-4 py-2 border">{u.email}</td>
                            <td className="px-4 py-2 border">{u.role}</td>
                            <td className="px-4 py-2 border">{u.banned ? "Yes" : "No"}</td>
                            <td className="px-4 py-2 border space-x-2">
                                {u.banned ? (
                                    <button onClick={() => handleUnban(u._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Unban</button>
                                ) : (
                                    <button onClick={() => handleBan(u._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Ban</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ---------------- Add Admin Form ---------------- */}
            <h2 className="text-xl font-bold mt-6">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="flex flex-col space-y-2 max-w-sm mt-2">
                <input type="text" placeholder="Name" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="border p-2 rounded" />
                <input type="password" placeholder="Password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="border p-2 rounded" />
                <button type="submit" disabled={addingAdmin} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {addingAdmin ? "Adding..." : "Add Admin"}
                </button>
            </form>
        </div>
    );
}
