const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getTasks);
router.post("/", requireRole("admin"), createTask);
router.patch("/:id", requireRole("admin"), updateTask);
router.delete("/:id", requireRole("admin"), deleteTask);

module.exports = router;