import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function TaskCard({ task, onUpdate }) {
    const nav = useNavigate();

    const toggleStatus = async () => {
        try {
            await API.put(`/tasks/${task._id}`, { status: task.status === "pending" ? "completed" : "pending" });
            onUpdate();
        } catch (err) {
            alert("Status update failed");
        }
    };

    const del = async () => {
        if (!confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${task._id}`);
            onUpdate();
        } catch {
            alert("Delete failed");
        }
    };

    const priorityBg = task.priority === "high" ? "bg-red-50 border-red-300" : task.priority === "medium" ? "bg-yellow-50 border-yellow-300" : "bg-green-50 border-green-300";

    return (
        <div
            className={`p-3 border rounded ${priorityBg}`}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify({ id: task._id }));
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <div className="text-sm text-slate-600">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                    <div className="text-sm">Status: <strong>{task.status}</strong></div>
                    {task.assignedTo && <div className="text-sm text-slate-600">Assigned: {task.assignedTo.name}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={toggleStatus} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Toggle</button>
                    <button onClick={() => nav(`/task/${task._id}`)} className="px-2 py-1 bg-gray-600 text-white rounded text-sm">Open</button>
                    <button onClick={del} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                </div>
            </div>
        </div>
    );
}
