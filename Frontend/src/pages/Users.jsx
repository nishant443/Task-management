import { useEffect, useState } from "react";
import API from "../api/api";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            setUsers(res.data);
        } catch {
            setUsers([]);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const addUser = async (e) => {
        e.preventDefault();
        try {
            await API.post("/users", form);
            setForm({ name: "", email: "", password: "" });
            fetchUsers();
        } catch (err) {
            alert("Create failed");
        }
    };

    const del = async (id) => {
        if (!confirm("Delete user?")) return;
        await API.delete(`/users/${id}`);
        fetchUsers();
    };

    return (
        <div>
            <h2 className="text-2xl mb-3">Users</h2>
            <form onSubmit={addUser} className="flex gap-2 mb-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 border rounded" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="p-2 border rounded" />
                <button className="px-3 py-1 bg-green-600 rounded text-white">Add</button>
            </form>

            <div className="space-y-2">
                {users.map(u => (
                    <div key={u._id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-sm text-slate-500">{u.email}</div>
                        </div>
                        <div>
                            <button onClick={() => del(u._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
