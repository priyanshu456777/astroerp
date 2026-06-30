const Task = require("../models/Task");
const { taskSchema, taskUpdateSchema } = require("../validators/taskTimetableValidators");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    return res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const task = await Task.create({
      ...parsed.data,
      ownerId: req.user._id,
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("Create task error:", error.message);
    return res.status(500).json({ message: "Server error while creating task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const parsed = taskUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    console.error("Update task error:", error.message);
    return res.status(500).json({ message: "Server error while updating task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    return res.status(500).json({ message: "Server error while deleting task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };