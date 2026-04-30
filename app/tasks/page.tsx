"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data?.tasks || []);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post("/tasks", { title: newTask });
      setTasks([...tasks, res.data as Task]);
      setNewTask("");
    } catch (err: any) {
      console.error("Failed to add task:", err);
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    try {
      const res = await api.put(`/tasks/${id}`, { completed: !task.completed });
      setTasks(tasks.map(t => (t._id === id ? (res.data as Task) : t)));
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading tasks...</div>;
  }

  return (
    <div className="tasks-page">
      <h2>My Tasks</h2>

      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first task!</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-card ${task.completed ? "completed" : ""}`}>
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => toggleTask(task._id)}
              />
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}