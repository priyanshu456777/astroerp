const Notice = require("../models/Notice");
const { noticeSchema } = require("../validators/noticeValidators");

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ notices });
  } catch (error) {
    console.error("Get notices error:", error.message);
    return res.status(500).json({ message: "Server error while fetching notices" });
  }
};

const createNotice = async (req, res) => {
  try {
    const parsed = noticeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const notice = await Notice.create({
      ...parsed.data,
      postedBy: req.user._id,
    });

    return res.status(201).json({ message: "Notice posted", notice });
  } catch (error) {
    console.error("Create notice error:", error.message);
    return res.status(500).json({ message: "Server error while creating notice" });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    return res.status(200).json({ message: "Notice deleted" });
  } catch (error) {
    console.error("Delete notice error:", error.message);
    return res.status(500).json({ message: "Server error while deleting notice" });
  }
};

module.exports = { getNotices, createNotice, deleteNotice };