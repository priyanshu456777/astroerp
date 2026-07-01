const express = require("express");
const router = express.Router();
const {
  getAllAssignments,
  getMyClassAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
} = require("../controllers/assignmentController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.use(protect);

router.get("/", getAllAssignments);
router.get("/my-class", getMyClassAssignments);
router.post("/", requireRole("admin"), upload.single("attachment"), createAssignment);
router.delete("/:id", requireRole("admin"), deleteAssignment);
router.post("/:id/submit", upload.single("file"), submitAssignment);
router.get("/:id/submissions", requireRole("admin"), getSubmissions);

module.exports = router;