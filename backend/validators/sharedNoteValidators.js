const { z } = require("zod");

const sharedNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.enum(["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Other"]),
  content: z.string().optional(),
});

module.exports = { sharedNoteSchema };