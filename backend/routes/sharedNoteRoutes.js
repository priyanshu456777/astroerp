const express = require("express");
const router = express.Router();
const { getSharedNotes, createSharedNote, deleteSharedNote } = require("../controllers/sharedNoteController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.use(protect);

router.get("/", getSharedNotes);
router.post("/", requireRole("admin"), upload.single("attachment"), createSharedNote);
router.delete("/:id", requireRole("admin"), deleteSharedNote);

module.exports = router;