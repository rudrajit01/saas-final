"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setError("");
      const res = await api.get("/tasks");
      setTasks(res.data?.data || res.data?.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await api.post("/tasks", {
        title: title.trim(),
        dueDate: dueDate || null,
        priority,
      });
      setTitle("");
      setDueDate("");
      setPriority("medium");
      await fetchTasks();
    } catch (err) {
      console.error("Create task error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const markCompleted = async (id) => {
    try {
      setError("");
      await api.put(`/tasks/${id}`, { status: "completed" });
      await fetchTasks();
    } catch (err) {
      console.error("Update task error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setError("");
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete task error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status !== "completed").length,
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-200 border-green-500/30";
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:px-6">
      {/* Header + Stats */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-cyan-500/10 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
              Manage your daily work
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Tasks
            </h1>
            <p className="max-w-md text-sm text-slate-400 md:text-base">
              Add tasks with priority & due date. Stay organized.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total</p>
              <p className="mt-1 text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-300">Completed</p>
              <p className="mt-1 text-3xl font-bold text-emerald-300">{stats.completed}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-300">Pending</p>
              <p className="mt-1 text-3xl font-bold text-amber-300">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-slate-900/40 p-1 backdrop-blur-md transition-all focus-within:border-cyan-500/50 focus-within:shadow-lg"
      >
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-400">Task title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write your task..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div className="w-full space-y-1 md:w-44">
            <label className="text-xs font-medium text-slate-400">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div className="w-full space-y-1 md:w-44">
            <label className="text-xs font-medium text-slate-400">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 md:mt-5"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-800 border-t-transparent" />
            ) : (
              "➕ Add Task"
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}
      <div className="bg-red-500 text-white p-4">Test Tailwind</div>
      {/* Task List */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-slate-400 backdrop-blur-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/20 p-12 text-center text-slate-400 backdrop-blur-sm">
          📭 No tasks yet. Create your first task above.
        </div>
      ) : (
        <div className="space-y-5">
          {tasks.map((task) => {
            const isCompleted = task.status === "completed";
            return (
              <div
                key={task._id}
                className={`group flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:flex-row md:items-center md:justify-between ${
                  isCompleted
                    ? "border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-slate-900/80 hover:border-emerald-400/50"
                    : "border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/60 hover:border-cyan-400/30"
                }`}
              >
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-6">
                  <div className="flex-1 space-y-1">
                    <h3
                      className={`text-lg font-medium leading-tight md:text-xl ${
                        isCompleted ? "text-slate-400 line-through" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 font-semibold ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === "high"
                          ? "🔴 High"
                          : task.priority === "medium"
                          ? "🟡 Medium"
                          : "🟢 Low"}
                      </span>
                      {task.dueDate && (
                        <span className="text-slate-400">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-amber-500/20 text-amber-200"
                        }`}
                      >
                        {isCompleted ? "✓ Completed" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end md:self-center">
                    {!isCompleted && (
                      <button
                        onClick={() => markCompleted(task._id)}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-md"
                      >
                        ✓ Complete
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-1.5 text-sm font-medium text-red-300 transition-all hover:bg-red-500/20 hover:shadow-md"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}