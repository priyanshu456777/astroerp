const Task = require("../models/Task");
const { taskSchema, taskUpdateSchema } = require("../validators/taskTimetableValidators");

// All tasks (for "All Tasks" tab — everyone can see everything, read-only unless it's their class)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("ownerId", "name teachingStream teachingSection")
      .sort({ dueDate: 1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    return res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// "My Class" tab — only tasks matching the logged-in student's stream+section
const getMyClassTasks = async (req, res) => {
  try {
    const { stream, section } = req.user;

    if (!stream || !section) {
      return res.status(200).json({ tasks: [] });
    }

    const tasks = await Task.find({ stream, section })
      .populate("ownerId", "name")
      .sort({ dueDate: 1 });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get my class tasks error:", error.message);
    return res.status(500).json({ message: "Server error while fetching class tasks" });
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

    const { teachingStream, teachingSection } = req.user;

    const task = await Task.create({
      ...parsed.data,
      stream: teachingStream || "",
      section: teachingSection || "",
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

module.exports = { getTasks, getMyClassTasks, createTask, updateTask, deleteTask };