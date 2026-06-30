const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: [true, "Status is required"],
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);