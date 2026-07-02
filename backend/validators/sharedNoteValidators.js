const { z } = require("zod");

const sharedNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().optional(),
});

module.exports = { sharedNoteSchema };