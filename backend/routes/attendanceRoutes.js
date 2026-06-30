const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAllStudents,
  getStudentAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/students", requireRole("admin"), getAllStudents);
router.post("/", requireRole("admin"), markAttendance);
router.delete("/:id", requireRole("admin"), deleteAttendance);
router.get("/me", getStudentAttendance);
router.get("/:studentId", requireRole("admin"), getStudentAttendance);

module.exports = router;