const Timetable = require("../models/Timetable");
const { timetableSchema, timetableUpdateSchema } = require("../validators/taskTimetableValidators");

const getTimetable = async (req, res) => {
  try {
    const entries = await Timetable.find().sort({ day: 1, startTime: 1 });
    return res.status(200).json({ entries });
  } catch (error) {
    console.error("Get timetable error:", error.message);
    return res.status(500).json({ message: "Server error while fetching timetable" });
  }
};

const createTimetableEntry = async (req, res) => {
  try {
    const parsed = timetableSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const entry = await Timetable.create({
      ...parsed.data,
      ownerId: req.user._id,
    });

    return res.status(201).json({ message: "Timetable entry created", entry });
  } catch (error) {
    console.error("Create timetable entry error:", error.message);
    return res.status(500).json({ message: "Server error while creating timetable entry" });
  }
};

const updateTimetableEntry = async (req, res) => {
  try {
    const parsed = timetableUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const entry = await Timetable.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    return res.status(200).json({ message: "Timetable entry updated", entry });
  } catch (error) {
    console.error("Update timetable entry error:", error.message);
    return res.status(500).json({ message: "Server error while updating timetable entry" });
  }
};

const deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    return res.status(200).json({ message: "Timetable entry deleted" });
  } catch (error) {
    console.error("Delete timetable entry error:", error.message);
    return res.status(500).json({ message: "Server error while deleting timetable entry" });
  }
};

module.exports = { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry };