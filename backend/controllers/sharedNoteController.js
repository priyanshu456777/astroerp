const SharedNote = require("../models/SharedNote");
const { sharedNoteSchema } = require("../validators/sharedNoteValidators");

const getSharedNotes = async (req, res) => {
  try {
    const notes = await SharedNote.find()
      .populate("postedBy", "name")
      .sort({ subject: 1, createdAt: -1 });
    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Get shared notes error:", error.message);
    return res.status(500).json({ message: "Server error while fetching shared notes" });
  }
};

const createSharedNote = async (req, res) => {
  try {
    const parsed = sharedNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const noteData = {
      ...parsed.data,
      postedBy: req.user._id,
    };

    if (req.file) {
      noteData.attachmentUrl = req.file.path;
      noteData.attachmentName = req.file.originalname;
    }

    const note = await SharedNote.create(noteData);
    return res.status(201).json({ message: "Shared note posted", note });
  } catch (error) {
    console.error("Create shared note error:", error.message);
    return res.status(500).json({ message: "Server error while creating shared note" });
  }
};

const deleteSharedNote = async (req, res) => {
  try {
    const note = await SharedNote.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Shared note not found" });
    }
    return res.status(200).json({ message: "Shared note deleted" });
  } catch (error) {
    console.error("Delete shared note error:", error.message);
    return res.status(500).json({ message: "Server error while deleting shared note" });
  }
};

module.exports = { getSharedNotes, createSharedNote, deleteSharedNote };