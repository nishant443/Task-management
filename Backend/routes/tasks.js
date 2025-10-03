const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const Task = require("../models/Task");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
} = require("../controllers/taskControllers");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id/status", auth, updateTaskStatus);
router.get("/admin/tasks", auth, adminOnly, async (req, res) => {
  const tasks = await Task.find();
  res.json({ tasks });
});

// User: get tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.json({ tasks });
});

router.get("/admin/tasks", auth, adminOnly, async (req, res) => {
  const tasks = await Task.find();
  res.json({ tasks });
});


module.exports = router;
