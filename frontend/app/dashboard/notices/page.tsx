"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface Notice {
  _id: string;
  title: string;
  body: string;
  postedBy: { name: string };
  createdAt: string;
}

export default function NoticesPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const loadNotices = async () => {
    try {
      const data = await apiFetch("/notices");
      setNotices(data.notices);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/notices", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ title: "", body: "" });
      setShowForm(false);
      loadNotices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await apiFetch(`/notices/${id}`, { method: "DELETE" });
      loadNotices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "+ Post Notice"}
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
            name="title"
            placeholder="Notice title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <textarea
            name="body"
            placeholder="Notice details"
            required
            rows={4}
            value={form.body}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Post
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="text-gray-500">No notices posted yet.</p>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notice.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                Posted by {notice.postedBy?.name} ·{" "}
                {new Date(notice.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}