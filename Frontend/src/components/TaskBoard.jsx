import { useEffect, useState } from "react";
import API from "../api/api";
import TaskColumn from "./TaskColumn";

export default function TaskBoard({ refreshSignal }) {
    const [tasks, setTasks] = useState([]);

    const fetch = async () => {
        try {
            const res = await API.get("/tasks?limit=1000"); // load all for board
            setTasks(res.data.tasks);
        } catch {
            setTasks([]);
        }
    };

    useEffect(() => { fetch(); }, [refreshSignal]);

    const handleDrop = async (taskId, newPriority) => {
        try {
            await API.put(`/tasks/${taskId}`, { priority: newPriority });
            fetch();
        } catch {
            alert("Move failed");
        }
    };

    const onTaskUpdated = () => fetch();

    const byPriority = (p) => tasks.filter(t => t.priority === p);

    return (
        <div className="flex gap-4">
            <TaskColumn title="High" tasks={byPriority("high")} onTaskUpdated={onTaskUpdated} onDropTask={handleDrop} />
            <TaskColumn title="Medium" tasks={byPriority("medium")} onTaskUpdated={onTaskUpdated} onDropTask={handleDrop} />
            <TaskColumn title="Low" tasks={byPriority("low")} onTaskUpdated={onTaskUpdated} onDropTask={handleDrop} />
        </div>
    );
}
