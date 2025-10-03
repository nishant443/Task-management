import { useEffect, useState } from "react";
import API from "../api/api";
import TaskCard from "./TaskCard";
import Pagination from "./Pagination";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks?page=${page}&limit=${limit}`);
            setTasks(res.data.tasks);
            setTotalPages(res.data.totalPages || 1);
        } catch {
            setTasks([]);
        }
    };

    useEffect(() => { fetchTasks(); }, [page]);

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-3">
                {tasks.map(t => <TaskCard key={t._id} task={t} onUpdate={fetchTasks} />)}
            </div>
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
    );
}
