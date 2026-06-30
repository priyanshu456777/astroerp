const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: [true, "Day is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    room: {
      type: String,
      trim: true,
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

timetableSchema.index({ ownerId: 1, day: 1, startTime: 1 });

module.exports = mongoose.model("Timetable", timetableSchema);