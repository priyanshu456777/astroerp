const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "student"]).optional(),

  // Student fields (optional at schema level, required conditionally in controller)
  age: z.coerce.number().min(10).max(100).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: z.string().optional(),
  stream: z.string().optional(),
  section: z.string().optional(),

  // Admin fields
  teachingStream: z.string().optional(),
  teachingSection: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };