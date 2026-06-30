const express = require("express");
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.use(protect);

router.get("/", getNotes);
router.post("/", upload.single("attachment"), createNote);
router.patch("/:id", upload.single("attachment"), updateNote);
router.delete("/:id", deleteNote);

module.exports = router;