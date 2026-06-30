const express = require("express");
const router = express.Router();
const {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} = require("../controllers/timetableController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getTimetable);
router.post("/", requireRole("admin"), createTimetableEntry);
router.patch("/:id", requireRole("admin"), updateTimetableEntry);
router.delete("/:id", requireRole("admin"), deleteTimetableEntry);

module.exports = router;