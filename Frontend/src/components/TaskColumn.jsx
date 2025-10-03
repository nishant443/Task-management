import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks, onTaskUpdated, onDropTask }) {
    return (
        <div
            className="flex-1 p-2 border rounded min-h-[200px] bg-white/3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const raw = e.dataTransfer.getData("text/plain");
                if (!raw) return;
                const { id } = JSON.parse(raw);
                onDropTask(id, title.toLowerCase());
            }}
        >
            <h4 className="font-bold mb-2">{title} <span className="text-sm text-slate-500">({tasks.length})</span></h4>
            <div className="flex flex-col gap-2">
                {tasks.map(t => <TaskCard key={t._id} task={t} onUpdate={onTaskUpdated} />)}
            </div>
        </div>
    );
}
