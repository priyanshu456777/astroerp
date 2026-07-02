const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Task = require("./models/Task");
const Assignment = require("./models/Assignment");
const SharedNote = require("./models/SharedNote");
const { STREAM_SUBJECTS } = require("./constants/streamSubjects");

// IMPORTANT: change this if your .env uses a different variable name for the Mongo connection string
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const SECTION = "A";

const taskTemplates = [
  { title: "Revise {subject} - Unit 1", priority: "medium" },
  { title: "Prepare notes for {subject} internal", priority: "high" },
];

const assignmentTemplates = [
  { title: "{subject} - Assignment 1", description: "Solve the practice problems shared in class and submit a handwritten/typed solution." },
  { title: "{subject} - Mini Project", description: "Work on the mini project brief discussed in class and submit before the deadline." },
];

const sharedNoteTemplates = [
  { title: "{subject} - Unit 1 Notes", content: "Consolidated notes covering the first unit syllabus. Refer before the internal exam." },
  { title: "{subject} - Important Questions", content: "Frequently asked and important questions for quick revision." },
  { title: "{subject} - Reference Material", content: "Additional reference material and examples for better understanding." },
];

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function seed() {
  if (!MONGO_URI) {
    console.error("No MongoDB URI found. Set MONGODB_URI (or MONGO_URI) in your .env file.");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const streams = Object.keys(STREAM_SUBJECTS);

  for (const stream of streams) {
    const subjects = STREAM_SUBJECTS[stream];
    const slug = stream.toLowerCase().replace(/[^a-z0-9]+/g, "");

    // 1. Create/find an admin (teacher) for this stream
    const adminEmail = `admin.${slug}@astroerp.test`;
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: `${stream} Admin`,
        email: adminEmail,
        password: "Admin@123",
        role: "admin",
        adminStatus: "approved",
        teachingStream: stream,
        teachingSection: SECTION,
      });
      console.log(`Created admin for ${stream}`);
    }

    // 2. Create/find a student for this stream
    const studentEmail = `student.${slug}@astroerp.test`;
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      student = await User.create({
        name: `${stream} Student`,
        email: studentEmail,
        password: "Student@123",
        role: "student",
        age: 19,
        gender: "other",
        dob: new Date("2006-01-01"),
        stream,
        section: SECTION,
      });
      console.log(`Created student for ${stream}`);
    }

    // 3. Tasks (owned by admin, visible to the class)
    for (let i = 0; i < taskTemplates.length; i++) {
      const subject = subjects[i % subjects.length];
      const tpl = taskTemplates[i];
      const title = tpl.title.replace("{subject}", subject);

      const exists = await Task.findOne({ title, stream, section: SECTION });
      if (!exists) {
        await Task.create({
          title,
          description: `Task related to ${subject} for ${stream} - Section ${SECTION}.`,
          dueDate: daysFromNow(7 + i * 3),
          priority: tpl.priority,
          status: "pending",
          stream,
          section: SECTION,
          ownerId: admin._id,
        });
      }
    }

    // 4. Assignments
    for (let i = 0; i < assignmentTemplates.length; i++) {
      const subject = subjects[i % subjects.length];
      const tpl = assignmentTemplates[i];
      const title = tpl.title.replace("{subject}", subject);

      const exists = await Assignment.findOne({ title, stream, section: SECTION });
      if (!exists) {
        await Assignment.create({
          title,
          description: tpl.description,
          stream,
          section: SECTION,
          dueDate: daysFromNow(10 + i * 4),
          postedBy: admin._id,
        });
      }
    }

    // 5. Shared notes (one per subject template, cycling through subjects)
    for (let i = 0; i < sharedNoteTemplates.length; i++) {
      const subject = subjects[i % subjects.length];
      const tpl = sharedNoteTemplates[i];
      const title = tpl.title.replace("{subject}", subject);

      const exists = await SharedNote.findOne({ title, stream, subject });
      if (!exists) {
        await SharedNote.create({
          title,
          stream,
          subject,
          content: tpl.content,
          postedBy: admin._id,
        });
      }
    }

    console.log(`Seeded data for ${stream}`);
  }

  console.log("\nSeeding complete!");
  console.log("Sample login (any stream): student.<slug>@astroerp.test / Student@123");
  console.log("Sample admin login: admin.<slug>@astroerp.test / Admin@123");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});