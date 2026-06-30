const express = require("express");
const router = express.Router();
const { getNotices, createNotice, deleteNotice } = require("../controllers/noticeController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getNotices);
router.post("/", requireRole("admin"), createNotice);
router.delete("/:id", requireRole("admin"), deleteNotice);

module.exports = router;