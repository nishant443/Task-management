import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import TaskForm from "../components/TaskForm";

export default function TaskDetails() {
    const { id } = useParams();
    const nav = useNavigate();
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(false);

    const fetch = async () => {
        try {
            const res = await API.get(`/tasks/${id}`);
            setTask(res.data);
        } catch {
            alert("Could not load task");
            nav("/");
        }
    };

    useEffect(() => { fetch(); }, [id]);

    const del = async () => {
        if (!confirm("Delete this task?")) return;
        await API.delete(`/tasks/${id}`);
        nav("/");
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl">{task.title}</h2>
                <div className="flex gap-2">
                    <button onClick={() => setEditing(e => !e)} className="px-3 py-1 bg-indigo-600 text-white rounded">{editing ? "Cancel" : "Edit"}</button>
                    <button onClick={del} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
            </div>

            {editing ? (
                <TaskForm editTask={task} onTaskAdded={fetch} />
            ) : (
                <div className="bg-white/5 p-4 rounded space-y-2">
                    <div><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</div>
                    <div><strong>Priority:</strong> {task.priority}</div>
                    <div><strong>Status:</strong> {task.status}</div>
                    <div><strong>Assigned:</strong> {task.assignedTo?.name || "—"}</div>
                    <div className="pt-2"><strong>Description:</strong><p className="mt-1">{task.description}</p></div>
                </div>
            )}
        </div>
    );
}
