"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface TimetableEntry {
  _id: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
  });

  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const loadEntries = async () => {
    try {
      const data = await apiFetch("/timetable");
      setEntries(data.entries);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/timetable", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ subject: "", day: "Monday", startTime: "", endTime: "", room: "" });
      setShowForm(false);
      loadEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this class?")) return;
    try {
      await apiFetch(`/timetable/${id}`, { method: "DELETE" });
      loadEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "+ Add Class"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-gray-200 mb-6 space-y-3">
          <input
            name="subject"
            placeholder="Subject name"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <div className="flex gap-3">
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              name="room"
              placeholder="Room (optional)"
              value={form.room}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex gap-3">
            <input
              name="startTime"
              type="time"
              required
              value={form.startTime}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="endTime"
              type="time"
              required
              value={form.endTime}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Save Class
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading timetable...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500">No classes added yet.</p>
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const dayEntries = entries.filter((e) => e.day === day);
            if (dayEntries.length === 0) return null;
            return (
              <div key={day}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">{day}</h2>
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{entry.subject}</p>
                        <p className="text-xs text-gray-500">
                          {entry.startTime} - {entry.endTime}
                          {entry.room ? ` · Room ${entry.room}` : ""}
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}