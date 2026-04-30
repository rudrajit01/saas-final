"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const router = useRouter();

  // টাস্ক লোড করা
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // টাস্ক যোগ করা
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle }),
    });
    if (res.ok) {
      setTaskTitle("");
      setShowForm(false);
      fetchTasks(); // লিস্ট রিফ্রেশ
      router.refresh();
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p>Welcome back</p>
          <h1>Overview</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)}>Add Task</button>
      </header>

      {showForm && (
        <form onSubmit={handleAddTask} className="quick-task-form">
          <input
            type="text"
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Focus Hours</h3>
          <p>6.5h</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card large">
          <h3>Today’s Tasks</h3>
          {tasks.length === 0 ? (
            <p>No tasks yet. Click "Add Task" to create one.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <input type="checkbox" checked={task.completed} readOnly />
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashboard-card">
          <h3>Project Progress</h3>
        </div>
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
        </div>
        <div className="dashboard-card large">
          <h3>Analytics Overview</h3>
        </div>
      </section>
    </div>
  );
}