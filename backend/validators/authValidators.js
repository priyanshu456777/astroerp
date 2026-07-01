const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
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