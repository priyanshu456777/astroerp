const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");

router.get("/ping-student", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you're authenticated as ${req.user.role}` });
});

router.get("/ping-admin", protect, requireRole("admin"), (req, res) => {
  res.json({ message: `Hello admin ${req.user.name}, role check passed` });
});

module.exports = router;