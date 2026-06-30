const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const adminRequestRoutes = require("./routes/adminRequestRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const noteRoutes = require("./routes/noteRoutes");
const sharedNoteRoutes = require("./routes/sharedNoteRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Smart Campus API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/admin-requests", adminRequestRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/shared-notes", sharedNoteRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});