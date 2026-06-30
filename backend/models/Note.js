const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
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
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

noteSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);