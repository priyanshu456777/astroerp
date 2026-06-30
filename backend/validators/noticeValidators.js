const { z } = require("zod");

const noticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

module.exports = { noticeSchema };