"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const loadTasks = async () => {
    try {
      const data = await apiFetch("/tasks");
      setTasks(data.tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ title: "", description: "", dueDate: "", priority: "medium" });
      setShowForm(false);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await apiFetch(`/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
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

  const priorityColor = (p: string) => {
    if (p === "high") return "bg-red-100 text-red-700";
    if (p === "medium") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "+ Add Task"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {showForm && isAdmin && (
        <form onSubmit={handleAddTask} className="bg-white p-5 rounded-xl border border-gray-200 mb-6 space-y-3">
          <input
            name="title"
            placeholder="Task title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <div className="flex gap-3">
            <input
              name="dueDate"
              type="date"
              required
              value={form.dueDate}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Save Task
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleComplete(task)}
                  className="w-4 h-4"
                />
                <div>
                  <p className={`font-medium ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}