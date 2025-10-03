import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Plus, Grid3X3, List, Calendar, Clock, TrendingUp, Users, CheckCircle, AlertCircle, Filter, Search, MoreVertical, Bell } from "lucide-react";


// Fixed API implementation - using React state instead of localStorage
const API = {
    baseURL: window.location.hostname === 'localhost' ? 'http://localhost:5000' : '',
    token: '',

    setToken: (token) => {
        API.token = token;
    },

    get: async (url) => {
        try {
            const response = await fetch(`${API.baseURL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    post: async (url, data) => {
        try {
            const response = await fetch(`${API.baseURL}${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    put: async (url, data) => {
        try {
            const response = await fetch(`${API.baseURL}${url}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    delete: async (url) => {
        try {
            const response = await fetch(`${API.baseURL}${url}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

const TaskForm = ({ onTaskAdded, onError }) => {
    const [message, setMessage] = useState({ text: '', type: '', show: false });
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending', // Changed to match backend default
        dueDate: '',

    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            onError('Task title is required');
            return;
        }

        setIsLoading(true);
        try {
            // Format data to match backend expectations
            const taskData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                assignedTo: formData.assignedTo || null
            };

            await API.post('/api/tasks', taskData); // Added /api prefix

            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                dueDate: '',
                assignedTo: ''
            });

            onTaskAdded();
        } catch (error) {
            onError('Failed to create task: ' + (error.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Task title..."
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Task description..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
                <div className="flex gap-3">
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <input
                        type="email"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        placeholder="Assign to (email)"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} />
                    {isLoading ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </div>
    );
};


const TaskBoard = ({ tasks, onTaskUpdate, onError }) => {
    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await API.put(`/api/tasks/${taskId}/status`, { status: newStatus }); // Use taskId
            onTaskUpdate();
        } catch (error) {
            onError('Failed to update task status: ' + (error.message || 'Unknown error'));
        }
    };


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} days`;
    };

    const statusConfig = [
        { key: 'pending', label: 'To Do', icon: AlertCircle, color: 'text-orange-500' },
        { key: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
        { key: 'completed', label: 'Done', icon: CheckCircle, color: 'text-green-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusConfig.map((status) => {
                const statusTasks = getTasksByStatus(status.key);
                const IconComponent = status.icon;

                return (
                    <div key={status.key} className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <IconComponent size={18} className={status.color} />
                                    {status.label}
                                </h3>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                                    {statusTasks.length}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                            {statusTasks.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No tasks</p>
                            ) : (
                                statusTasks.map((task) => (
                                    <div key={task._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                                        <h4 className="font-medium text-gray-800 mb-2">{task.title}</h4>
                                        {task.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {task.assignedTo && (
                                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                                                        {typeof task.assignedTo === 'object' && task.assignedTo.name
                                                            ? task.assignedTo.name.charAt(0).toUpperCase()
                                                            : task.assignedTo.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {task.dueDate && (
                                                    <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-1">
                                            {statusConfig.map((newStatus) => (
                                                <button
                                                    key={newStatus.key}
                                                    onClick={() => handleStatusChange(task._id, newStatus.key)}
                                                    disabled={newStatus.key === task.status}
                                                    className={`px-2 py-1 rounded text-xs transition-colors ${newStatus.key === task.status
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {newStatus.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TaskList = ({ tasks, onTaskUpdate, onError }) => {
    const handleToggleComplete = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await API.put(`/api/tasks/${task._id}/status`, { status: newStatus });
            onTaskUpdate();
        } catch (error) {
            onError('Failed to update task: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDeleteTask = async (taskId) => {
        // Show a confirmation toast with custom actions
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this task?</p>
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id); // close the toast
                            try {
                                await API.delete(`/api/tasks/${taskId}`);
                                onTaskUpdate();
                                toast.success("Task deleted successfully!");
                            } catch (error) {
                                onError("Failed to delete task: " + (error.message || "Unknown error"));
                                toast.error("Failed to delete task!");
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 rounded text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'pending': return 'Pending';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">All Tasks ({tasks.length})</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter size={18} className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {tasks.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No tasks available</div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={task.status === 'completed'}
                                    onChange={() => handleToggleComplete(task)}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <div className="flex-1">
                                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                        {task.title}
                                    </h4>
                                    {task.description && (
                                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{task.description}</p>
                                    )}
                                    {task.dueDate && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                    {task.assignedTo && (
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                                            {typeof task.assignedTo === 'object' && task.assignedTo.name
                                                ? task.assignedTo.name.charAt(0).toUpperCase()
                                                : task.assignedTo.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        className="text-red-500 hover:text-red-700 p-1 text-lg font-bold"
                                        title="Delete task"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [filters, setFilters] = useState({ status: '', priority: '', dueDate: '' });
    const [tempFilters, setTempFilters] = useState({ status: '', priority: '', dueDate: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [view, setView] = useState("board");
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        inProgress: 0,
        completed: 0,
        teamMembers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = async () => {
    try {
        setLoading(true);

        let allTasks = [];
        let page = 1;
        let totalPages = 1;

        do {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.dueDate) params.append('dueDate', filters.dueDate);
            params.append('page', page);
            params.append('limit', 10); // fetch 10 tasks per page

            const response = await API.get(`/api/tasks?${params.toString()}`);

            // Make sure to get tasks array correctly
            const tasksData = response.tasks || response.data?.tasks || [];
            allTasks = [...allTasks, ...tasksData];

            // Set totalPages safely
            totalPages = response.totalPages || response.data?.totalPages || 1;
            page++;
        } while (page <= totalPages);

        setTasks(allTasks);

        // Stats calculation
        const total = allTasks.length;
        const inProgress = allTasks.filter(task => task.status === 'in-progress').length;
        const completed = allTasks.filter(task => task.status === 'completed').length;

        const uniqueMembers = new Set();
        allTasks.forEach(task => {
            if (task.assignedTo) {
                if (typeof task.assignedTo === 'object' && task.assignedTo._id) uniqueMembers.add(task.assignedTo._id);
                else if (typeof task.assignedTo === 'string') uniqueMembers.add(task.assignedTo);
            }
            if (task.createdBy) {
                if (typeof task.createdBy === 'object' && task.createdBy._id) uniqueMembers.add(task.createdBy._id);
                else if (typeof task.createdBy === 'string') uniqueMembers.add(task.createdBy);
            }
        });

        setStats({
            total,
            inProgress,
            completed,
            teamMembers: uniqueMembers.size
        });

    } catch (error) {
        setError('Failed to fetch tasks: ' + (error.message || 'Unknown error'));
        console.error('Error fetching tasks:', error);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleTaskUpdate = () => {
        fetchTasks();
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                        <p className="text-gray-600">Manage your tasks and stay productive</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                            <Bell size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Grid3X3 size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock size={24} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Team Members</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.teamMembers}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Users size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                        <div className="flex items-center gap-2 relative">
                            <button
                                onClick={() => setShowFilter((prev) => !prev)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            >
                                <Filter size={16} />
                                Filter
                            </button>

                            {showFilter && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-10 space-y-3">
                                    <select
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2"
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Done</option>
                                    </select>

                                    <select
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2"
                                        value={filters.priority}
                                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>

                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2"
                                        value={filters.dueDate}
                                        onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                                    />

                                    <button
                                        onClick={() => {
                                            setTempFilters({ status: '', priority: '', dueDate: '' });
                                            setFilters({ status: '', priority: '', dueDate: '' });
                                            setShowFilter(false);
                                        }}
                                        className="w-full bg-red-400 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}

                            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                                <Calendar size={16} />
                                Today
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                        >
                            <Plus size={18} />
                            Create Task
                        </button>
                        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                            <button
                                onClick={() => setView("board")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "board"
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <Grid3X3 size={16} />
                                Board
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "list"
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <List size={16} />
                                List
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {view === "board" ? (
                        <TaskBoard
                            tasks={filteredTasks}
                            onTaskUpdate={handleTaskUpdate}
                            onError={handleError}
                        />
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            onTaskUpdate={handleTaskUpdate}
                            onError={handleError}
                        />
                    )}
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Plus size={18} />
                                    Create New Task
                                </h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-white/80 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 bg-gray-50">
                                <TaskForm
                                    onTaskAdded={() => {
                                        handleTaskUpdate();
                                        setShowCreateModal(false);
                                    }}
                                    onError={handleError}
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}