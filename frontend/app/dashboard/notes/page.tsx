"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Note {
  _id: string;
  title: string;
  content?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await apiFetch("/notes");
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
      formData.append("content", content);
      if (file) {
        formData.append("attachment", file);
      }

      await apiFetch("/notes", {
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
    if (!confirm("Delete this note?")) {
      return;
    }
    try {
      await apiFetch(`/notes/${id}`, { method: "DELETE" });
      loadNotes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
        >
          {showForm ? "Cancel" : "+ Add Note"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 mb-6 space-y-3">
          <input
            placeholder="Note title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <textarea
            placeholder="Write your note..."
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
            {submitting ? "Saving..." : "Save Note"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Add your first note above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Delete
                </button>
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
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}