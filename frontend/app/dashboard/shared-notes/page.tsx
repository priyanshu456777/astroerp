"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { STREAM_SUBJECTS } from "@/lib/streamSubjects";

interface SharedNote {
  _id: string;
  title: string;
  subject: string;
  stream: string;
  content?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  postedBy: { name: string };
  createdAt: string;
}

export default function SharedNotesPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const userStream = isAdmin ? user?.teachingStream : user?.stream;
  const subjects = STREAM_SUBJECTS[userStream || ""] || [];

  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0] || "");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");

  const loadNotes = async () => {
    try {
      const data = await apiFetch("/shared-notes");
      setNotes(data.notes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("content", content);
      if (file) {
        formData.append("attachment", file);
      }

      await apiFetch("/shared-notes", {
        method: "POST",
        body: formData,
      });

      setTitle("");
      setContent("");
      setFile(null);
      setShowForm(false);
      loadNotes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shared note?")) {
      return;
    }
    try {
      await apiFetch(`/shared-notes/${id}`, { method: "DELETE" });
      loadNotes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredNotes = filter === "All" ? notes : notes.filter((n) => n.subject === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shared Notes</h1>
          {userStream && (
            <p className="text-sm text-gray-500 mt-0.5">{userStream} class resources</p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "+ Add Shared Note"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 mb-6 space-y-3">
          <input
            placeholder="Note title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Note details (optional)"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (optional - image or PDF, max 5MB)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Shared Note"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("All")}
          className={
            filter === "All"
              ? "px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white"
              : "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          }
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white"
                : "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            }
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading shared notes...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-gray-500">No shared notes here yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                    {note.subject}
                  </span>
                  <h3 className="font-semibold text-gray-900">{note.title}</h3>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              {note.content ? (
                <p className="text-sm text-gray-600 mt-2">{note.content}</p>
              ) : null}
              {note.attachmentUrl ? (
                <a
                  href={note.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium mt-3 hover:underline"
                >
                  Attachment: {note.attachmentName ? note.attachmentName : "View file"}
                </a>
              ) : null}
              <p className="text-xs text-gray-400 mt-2">
                Posted by {note.postedBy?.name} · {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}