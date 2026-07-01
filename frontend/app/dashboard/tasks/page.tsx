"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  stream?: string;
  section?: string;
  ownerId?: { name: string; teachingStream?: string; teachingSection?: string };
}

export default function TasksPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<"myclass" | "all">("myclass");
  const [myClassTasks, setMyClassTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const [allData, myData] = await Promise.all([
        apiFetch("/tasks"),
        !isAdmin ? apiFetch("/tasks/my-class") : Promise.resolve({ tasks: [] }),
      ]);
      setAllTasks(allData.tasks);
      setMyClassTasks(myData.tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description, dueDate, status: "pending", priority: "medium" }),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ status: "completed" }) });
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isOverdue = (date?: string) => date && new Date(date) < new Date();

  const TaskCard = ({ task, showActions }: { task: Task; showActions: boolean }) => (
    <div className={`bg-white border rounded-xl p-4 transition-all hover:shadow-md ${
      task.status === "completed" ? "opacity-60 border-gray-100" : "border-gray-200"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {task.stream && task.section && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {task.stream} — {task.section}
              </span>
            )}
            {task.status === "completed" && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Completed</span>
            )}
            {task.dueDate && isOverdue(task.dueDate) && task.status !== "completed" && (
              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Overdue</span>
            )}
          </div>
          <p className={`font-semibold text-gray-900 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </p>
          {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {task.dueDate && (
              <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-500" : "text-gray-400"}`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.ownerId?.name && (
              <span className="text-xs text-gray-400">By {task.ownerId.name}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {showActions && task.status !== "completed" && !isAdmin && (
            <button
              onClick={() => handleComplete(task._id)}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              ✓ Done
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => handleDelete(task._id)}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const displayTasks = activeTab === "myclass"
    ? (isAdmin ? allTasks.filter(t => t.stream === user?.teachingStream && t.section === user?.teachingSection) : myClassTasks)
    : allTasks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Task"}
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
            <span>This task will be posted for <strong>{user?.teachingStream} — Section {user?.teachingSection}</strong></span>
          </div>
          <input
            placeholder="Task title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <textarea
            placeholder="Description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Posting..." : "Post Task"}
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("myclass")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "myclass"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {isAdmin
            ? `My Class (${user?.teachingStream} — ${user?.teachingSection})`
            : `My Class (${user?.stream} — ${user?.section})`}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Tasks
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
            {allTasks.length}
          </span>
        </button>
      </div>

      {/* Task list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      ) : displayTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No tasks here yet</p>
          <p className="text-sm mt-1">
            {activeTab === "myclass" ? "Your class has no tasks posted yet." : "No tasks have been posted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              showActions={activeTab === "myclass"}
            />
          ))}
        </div>
      )}
    </div>
  );
}