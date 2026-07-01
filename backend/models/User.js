const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin", "superadmin"], default: "student" },
    adminStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },

    department: { type: String, default: "" },
    profilePic: { type: String, default: "" },

    // Student fields
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    stream: { type: String },
    section: { type: String },

    // Admin/Teacher fields
    teachingStream: { type: String },
    teachingSection: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);