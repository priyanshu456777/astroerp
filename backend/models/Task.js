const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ ownerId: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);