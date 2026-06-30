const { z } = require("zod");

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});

const taskUpdateSchema = taskSchema.partial();

const timetableSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  room: z.string().optional(),
});

const timetableUpdateSchema = timetableSchema.partial();

module.exports = {
  taskSchema,
  taskUpdateSchema,
  timetableSchema,
  timetableUpdateSchema,
};