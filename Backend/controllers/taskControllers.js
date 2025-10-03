const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    try {
        const task = new Task({
            title,
            description,
            dueDate: dueDate || null,
            priority,
            createdBy: req.user._id,
            assignedTo: assignedTo || null
        });

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all tasks with pagination
exports.getTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.user.role !== "admin") {
        filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.dueDate) {
        const date = new Date(req.query.dueDate);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        filter.dueDate = { $gte: date, $lt: nextDay };
    }

    try {
        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ dueDate: 1, priority: -1 })
                .skip(skip)
                .limit(limit)
                .populate("assignedTo", "name email"),
            Task.countDocuments(filter)
        ]);

        res.json({
            tasks,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const updates = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not allowed" });
        }

        task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not allowed" });
        }

        await task.deleteOne();
        res.json({ msg: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
