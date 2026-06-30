const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { attendanceSchema } = require("../validators/attendanceValidators");

const markAttendance = async (req, res) => {
  try {
    const parsed = attendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { studentId, date, status, subject } = parsed.data;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const record = await Attendance.findOneAndUpdate(
      { studentId, date: new Date(date), subject: subject || "" },
      { status, markedBy: req.user._id },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Attendance marked", record });
  } catch (error) {
    console.error("Mark attendance error:", error.message);
    return res.status(500).json({ message: "Server error while marking attendance" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    return res.status(200).json({ students });
  } catch (error) {
    console.error("Get students error:", error.message);
    return res.status(500).json({ message: "Server error while fetching students" });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const targetId = req.params.studentId || req.user._id;

    if (req.user.role !== "admin" && String(req.user._id) !== String(targetId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const records = await Attendance.find({ studentId: targetId }).sort({ date: -1 });

    const total = records.length;
    const presentCount = records.filter((r) => r.status === "present").length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    const subjectMap = {};
    records.forEach((r) => {
      const key = r.subject && r.subject.trim() !== "" ? r.subject : "General";
      if (!subjectMap[key]) {
        subjectMap[key] = { subject: key, total: 0, present: 0 };
      }
      subjectMap[key].total += 1;
      if (r.status === "present") subjectMap[key].present += 1;
    });

    const subjectStats = Object.values(subjectMap).map((s) => ({
      subject: s.subject,
      total: s.total,
      present: s.present,
      percentage: Math.round((s.present / s.total) * 100),
    }));

    return res.status(200).json({ records, total, presentCount, percentage, subjectStats });
  } catch (error) {
    console.error("Get attendance error:", error.message);
    return res.status(500).json({ message: "Server error while fetching attendance" });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    return res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    console.error("Delete attendance error:", error.message);
    return res.status(500).json({ message: "Server error while deleting record" });
  }
};

module.exports = { markAttendance, getAllStudents, getStudentAttendance, deleteAttendance };