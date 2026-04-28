'use client'

import { useEffect, useState } from "react";
import api from "@/services/api";
import WeatherWidget from "@/components/WeatherWidget";
import RecentNews from "@/components/RecentNews";
import CalendarWidget from "@/components/CalendarWidget";

function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [summary, setSummary] = useState({
    totalNotes: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    upcomingTasks: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || parsedUser.username || "User");
      } catch (err) {
        console.error("User parse error:", err);
      }
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/dashboard");
        const dashboardData = res.data?.summary || res.data || {};

        setSummary({
          totalNotes: dashboardData.totalNotes ?? 0,
          totalTasks: dashboardData.totalTasks ?? 0,
          pendingTasks: dashboardData.pendingTasks ?? 0,
          completedTasks: dashboardData.completedTasks ?? 0,
          upcomingTasks: Array.isArray(dashboardData.upcomingTasks)
            ? dashboardData.upcomingTasks
            : [],
        });
      } catch (err) {
        console.error("Dashboard load error:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (err.response?.status === 404) {
          setError("Dashboard route not found.");
        } else {
          setError(err.response?.data?.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h2 className="error-text">{error}</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2>Welcome, {userName} 👋</h2>
        <h3>Your productivity snapshot is ready⚡</h3>
      </div>

      <div className="top-widgets">
        <WeatherWidget />
        <CalendarWidget tasks={summary.upcomingTasks} />
        <RecentNews />
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Notes</h3>
          <p>{summary.totalNotes}</p>
        </div>

        <div className="summary-card">
          <h3>Total Tasks</h3>
          <p>{summary.totalTasks}</p>
        </div>

        <div className="summary-card">
          <h3>Pending Tasks</h3>
          <p>{summary.pendingTasks}</p>
        </div>

        <div className="summary-card">
          <h3>Completed Tasks</h3>
          <p>{summary.completedTasks}</p>
        </div>
      </div>

      <div className="list-card">
        <h3>Upcoming Tasks</h3>

        {summary.upcomingTasks.length === 0 ? (
          <p className="empty-text">No upcoming tasks</p>
        ) : (
          <ul>
            {summary.upcomingTasks.map((task) => (
              <li key={task._id} className="task-item">
                <strong>{task.title}</strong>
                <p>Priority: {task.priority || "Not set"}</p>
                <p>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
