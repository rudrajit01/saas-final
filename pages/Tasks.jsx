'use client'

import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      setError("");

      await api.post("/tasks", {
        title: title.trim(),
        dueDate: dueDate || null,
        priority,
      });

      setTitle("");
      setDueDate("");
      setPriority("medium");

      fetchTasks();
    } catch (err) {
      console.error("Create task error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const markCompleted = async (id) => {
    try {
      setError("");

      await api.put(`/tasks/${id}`, {
        status: "completed",
      });

      fetchTasks();
    } catch (err) {
      console.error("Update task error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="tasks-page">
      <h2>Tasks</h2>

      {error && <p className="error-text">{error}</p>}

      <div className="page-grid">
        <div className="form-card">
          <h3>Add New Task</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button type="submit" className="primary-btn">
              Add Task
            </button>
          </form>
        </div>

        <div className="tasks-card">
          <h3>Your Tasks</h3>

          {loading ? (
            <p className="muted-text">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-text">No tasks found</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <strong>{task.title}</strong>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <p>
                    Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </p>

                  {task.status !== "completed" && (
                    <button
                      className="secondary-btn"
                      onClick={() => markCompleted(task._id)}
                    >
                      Mark Completed
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;