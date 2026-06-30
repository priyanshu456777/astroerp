"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  status: "present" | "absent";
  subject?: string;
}

interface SubjectStat {
  subject: string;
  total: number;
  present: number;
  percentage: number;
}

export default function AttendancePage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  return isAdmin ? <AdminAttendanceView /> : <StudentAttendanceView />;
}

function AdminAttendanceView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("present");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/attendance/students")
      .then((data) => {
        setStudents(data.students);
        if (data.students.length > 0) setSelectedStudent(data.students[0]._id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiFetch("/attendance", {
        method: "POST",
        body: JSON.stringify({ studentId: selectedStudent, date, status, subject }),
      });
      setMessage("Attendance marked successfully");
      setDate("");
      setSubject("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mark Attendance</h1>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <p className="text-gray-500">No students registered yet.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 space-y-3 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}

function StudentAttendanceView() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [total, setTotal] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/attendance/me")
      .then((data) => {
        setRecords(data.records);
        setPercentage(data.percentage);
        setTotal(data.total);
        setPresentCount(data.presentCount);
        setSubjectStats(data.subjectStats || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Attendance</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 max-w-sm">
        <p className="text-sm text-gray-500">Overall Attendance</p>
        <p
          className={`text-4xl font-bold mt-1 ${
            percentage >= 75 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {percentage}%
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {presentCount} present out of {total} classes
        </p>
      </div>

      {subjectStats.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectStats.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{s.subject}</span>
                  <span className="text-sm text-gray-500">
                    {s.present}/{s.total} ({s.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      s.percentage >= 75 ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-semibold text-gray-900 mb-3">History</h2>
      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records yet.</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r._id}
              className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(r.date).toLocaleDateString()}
                </p>
                {r.subject && <p className="text-xs text-gray-500">{r.subject}</p>}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.status === "present"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}