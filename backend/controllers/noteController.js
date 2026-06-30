const Note = require("../models/Note");
const { noteSchema } = require("../validators/noteValidators");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Get notes error:", error.message);
    return res.status(500).json({ message: "Server error while fetching notes" });
  }
};

const createNote = async (req, res) => {
  try {
    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const noteData = {
      ...parsed.data,
      ownerId: req.user._id,
    };

    if (req.file) {
      noteData.attachmentUrl = req.file.path;
      noteData.attachmentName = req.file.originalname;
    }

    const note = await Note.create(noteData);
    return res.status(201).json({ message: "Note created", note });
  } catch (error) {
    console.error("Create note error:", error.message);
    return res.status(500).json({ message: "Server error while creating note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const parsed = noteSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const updates = { ...parsed.data };
    if (req.file) {
      updates.attachmentUrl = req.file.path;
      updates.attachmentName = req.file.originalname;
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    console.error("Update note error:", error.message);
    return res.status(500).json({ message: "Server error while updating note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error.message);
    return res.status(500).json({ message: "Server error while deleting note" });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };