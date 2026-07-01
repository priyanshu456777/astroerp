const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "login"], required: true },
    payload: { type: Object, default: {} }, // stores signup form data temporarily until OTP is verified
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Automatically deletes expired OTP documents from MongoDB
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);