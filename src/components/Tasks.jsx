"use client";

import { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });

    if (res.ok) {
      setNewTask("");
      fetchTasks();
    }
  };

  const handleToggleTask = async (task) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    });

    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  return (
    <div>
      <h1>Tasks</h1>

      <div>
        <input
          type="text"
          value={newTask}
          placeholder="Enter task"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              onClick={() => handleToggleTask(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}