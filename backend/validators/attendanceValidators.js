const { z } = require("zod");

const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["present", "absent"]),
  subject: z.string().optional(),
});

module.exports = { attendanceSchema };