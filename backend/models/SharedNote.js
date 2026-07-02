const mongoose = require("mongoose");

const sharedNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    stream: {
      type: String,
      required: [true, "Stream is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    attachmentUrl: {
      type: String,
      default: "",
    },
    attachmentName: {
      type: String,
      default: "",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

sharedNoteSchema.index({ stream: 1, subject: 1, createdAt: -1 });

module.exports = mongoose.model("SharedNote", sharedNoteSchema);