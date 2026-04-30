"use client";

import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

// লোকাল স্টোরেজ হেল্পার ফাংশন
const getTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("my_tasks");
  return stored ? JSON.parse(stored) : [];
};

const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("my_tasks", JSON.stringify(tasks));
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  // tasks পরিবর্তন হলে স্টোরেজ আপডেট হবে
  useEffect(() => {
    const storedTasks = getTasksFromStorage();
    setTasks(storedTasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, loading]);

  const addTask = () => {
    if (!newTask.trim()) return;
    try {
      const newId = Date.now().toString();
      const newTaskObj: Task = {
        _id: newId,
        title: newTask.trim(),
        completed: false,
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask("");
      setError(null);
    } catch (err) {
      setError("টাস্ক যোগ করতে ব্যর্থ হয়েছে");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  if (loading) return <div>লোড হচ্ছে...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>📋 আমার কাজের তালিকা</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="নতুন টাস্ক লিখুন..."
          style={{ padding: "8px", marginRight: "8px", width: "250px" }}
        />
        <button onClick={addTask} style={{ padding: "8px 16px" }}>
          যোগ করুন
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>কোনো টাস্ক নেই। উপরে যোগ করুন।</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task._id)}
                style={{ backgroundColor: "#ff4444", color: "white", border: "none", padding: "4px 12px", borderRadius: "4px" }}
              >
                মুছুন
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
