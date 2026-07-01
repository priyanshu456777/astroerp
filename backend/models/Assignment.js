const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    stream: { type: String, required: true },
    section: { type: String, required: true },
    dueDate: { type: Date, required: true },
    attachmentUrl: { type: String, default: "" },
    attachmentName: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);