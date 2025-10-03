import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function TaskForm({ onTaskAdded, editTask }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        assignedTo: ""
    });
    const [users, setUsers] = useState([]);

    // Load task details if editing
    useEffect(() => {
        if (editTask) {
            setForm({
                title: editTask.title || "",
                description: editTask.description || "",
                dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : "",
                priority: editTask.priority || "low",
                assignedTo: editTask.assignedTo?._id || ""
            });
        }
    }, [editTask]);

    // Fetch users for assignment dropdown
    useEffect(() => {
        API.get("/users")
            .then(res => setUsers(res.data || []))
            .catch(() => {
                toast.error("Failed to load users");
                setUsers([]);
            });
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }

        const payload = {
            title: form.title,
            description: form.description || "",
            priority: form.priority,
            dueDate: form.dueDate || null,
            assignedTo: form.assignedTo || null
        };

        try {
            if (editTask) {
                await API.put(`/tasks/${editTask._id}`, payload);
                toast.success("Task updated successfully ✅");
            } else {
                await API.post("/tasks", payload);
                toast.success("Task created successfully 🎉");
            }

            onTaskAdded?.(); // refresh parent list

            // Reset form if creating a new task
            if (!editTask) {
                setForm({
                    title: "",
                    description: "",
                    dueDate: "",
                    priority: "low",
                    assignedTo: ""
                });
            }
        } catch (err) {
            console.error("TaskForm error:", err);
            toast.error(err.response?.data?.message || "Failed to save task ❌");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow space-y-3"
        >
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task Title"
                required
                className="w-full p-2 border rounded"
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Task Description"
                className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
                <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="p-2 border rounded flex-1"
                />
                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="p-2 border rounded flex-1"
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className="p-2 border rounded flex-1"
                >
                    <option value="">Assign to (optional)</option>
                    {users.map((u) => (
                        <option key={u._id} value={u._id}>
                            {u.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                {editTask ? "Update Task" : "Create Task"}
            </button>
        </form>
    );
}
