"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  stream: string;
  section: string;
  attachmentUrl?: string;
  attachmentName?: string;
  submitted?: boolean;
  postedBy?: { name: string };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || "";
}

export default function AssignmentsPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<"myclass" | "all">("myclass");
  const [myClassAssignments, setMyClassAssignments] = useState<Assignment[]>([]);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitFile, setSubmitFile] = useState<File | null>(null);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const [allData, myData] = await Promise.all([
        apiFetch("/assignments"),
        !isAdmin ? apiFetch("/assignments/my-class") : Promise.resolve({ assignments: [] }),
      ]);
      setAllAssignments(allData.assignments);
      setMyClassAssignments(myData.assignments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", dueDate);
      if (file) formData.append("attachment", file);

      const res = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create assignment");

      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setShowForm(false);
      loadAssignments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await apiFetch(`/assignments/${id}`, { method: "DELETE" });
      loadAssignments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    setSubmittingId(assignmentId);
    setError("");
    try {
      const formData = new FormData();
      if (submitFile) formData.append("file", submitFile);

      const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setSubmitFile(null);
      loadAssignments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const isOverdue = (date: string) => new Date(date) < new Date();
  const daysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const AssignmentCard = ({ a, mine }: { a: Assignment; mine: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {a.stream} — {a.section}
            </span>
            {a.submitted && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Submitted
              </span>
            )}
            {!a.submitted && isOverdue(a.dueDate) && (
              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Overdue
              </span>
            )}
            {!a.submitted && !isOverdue(a.dueDate) && daysLeft(a.dueDate) <= 2 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Due soon
              </span>
            )}
          </div>

          <p className="font-semibold text-gray-900">{a.title}</p>
          {a.description && <p className="text-sm text-gray-500 mt-1">{a.description}</p>}

          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-400">
            <span className={isOverdue(a.dueDate) && !a.submitted ? "text-red-500 font-medium" : ""}>
              Due: {new Date(a.dueDate).toLocaleDateString()}
            </span>
            {a.postedBy?.name && <span>By {a.postedBy.name}</span>}
            {a.attachmentUrl && (
              <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                📎 {a.attachmentName || "Attachment"}
              </a>
            )}
          </div>

          {mine && !isAdmin && !a.submitted && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <input
                type="file"
                onChange={(e) => setSubmitFile(e.target.files?.[0] || null)}
                className="text-xs text-gray-500 file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-gray-100 file:text-xs file:font-medium hover:file:bg-gray-200"
              />
              <button
                onClick={() => handleSubmit(a._id)}
                disabled={submittingId === a._id}
                className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submittingId === a._id ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => handleDelete(a._id)}
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  const displayAssignments = activeTab === "myclass"
    ? (isAdmin ? allAssignments.filter(a => a.stream === user?.teachingStream && a.section === user?.teachingSection) : myClassAssignments)
    : allAssignments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            {showForm ? "Cancel" : "+ New Assignment"}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-2">
            <span>📌</span>
            <span>This assignment will be posted for <strong>{user?.teachingStream} — Section {user?.teachingSection}</strong></span>
          </div>
          <input
            placeholder="Assignment title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <textarea
            placeholder="Description / instructions"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Attachment (optional)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-500 file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-gray-100 file:text-xs file:font-medium hover:file:bg-gray-200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Posting..." : "Post Assignment"}
          </button>
        </form>
      )}

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("myclass")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "myclass" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {isAdmin ? `My Class (${user?.teachingStream} — ${user?.teachingSection})` : `My Class (${user?.stream} — ${user?.section})`}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Assignments
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{allAssignments.length}</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading assignments...</p>
      ) : displayAssignments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-medium">No assignments here yet</p>
          <p className="text-sm mt-1">
            {activeTab === "myclass" ? "Your class has no assignments posted yet." : "No assignments have been posted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAssignments.map((a) => (
            <AssignmentCard key={a._id} a={a} mine={activeTab === "myclass"} />
          ))}
        </div>
      )}
    </div>
  );
}