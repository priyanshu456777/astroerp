const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("postedBy", "name teachingStream teachingSection")
      .sort({ dueDate: 1 });
    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyClassAssignments = async (req, res) => {
  try {
    const { stream, section } = req.user;
    const assignments = await Assignment.find({ stream, section })
      .populate("postedBy", "name")
      .sort({ dueDate: 1 });

    const submittedIds = await Submission.find({ student: req.user._id }).distinct("assignment");

    const assignmentsWithStatus = assignments.map((a) => ({
      ...a.toObject(),
      submitted: submittedIds.map(String).includes(String(a._id)),
    }));

    return res.status(200).json({ assignments: assignmentsWithStatus });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const { teachingStream, teachingSection } = req.user;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date are required" });
    }

    const assignmentData = {
      title,
      description,
      dueDate,
      stream: teachingStream,
      section: teachingSection,
      postedBy: req.user._id,
    };

    if (req.file) {
      assignmentData.attachmentUrl = req.file.path;
      assignmentData.attachmentName = req.file.originalname;
    }

    const assignment = await Assignment.create(assignmentData);
    return res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Assignment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const existing = await Submission.findOne({
      assignment: req.params.id,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const submissionData = {
      assignment: req.params.id,
      student: req.user._id,
    };

    if (req.file) {
      submissionData.fileUrl = req.file.path;
      submissionData.fileName = req.file.originalname;
    }

    const submission = await Submission.create(submissionData);
    return res.status(201).json({ message: "Submitted successfully", submission });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate("student", "name stream section");
    return res.status(200).json({ submissions });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllAssignments,
  getMyClassAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
};