'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Analytics() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedTasks = localStorage.getItem("tasks");

    if (!token) {
      router.push("/login");
      return;
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [router]);

  const analytics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const productivityScore = Math.min(100, completionRate + (total >= 5 ? 10 : 0));
    const focusScore = total === 0 ? 0 : Math.max(40, 100 - pending * 8);

    return {
      total,
      completed,
      pending,
      completionRate,
      productivityScore,
      focusScore,
    };
  }, [tasks]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="analytics-label">Performance Insights</p>
          <h1>Analytics Overview</h1>
        </div>

        <button className="back-btn" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Tasks</h3>
          <p>{analytics.total}</p>
        </div>

        <div className="analytics-card">
          <h3>Completed</h3>
          <p>{analytics.completed}</p>
        </div>

        <div className="analytics-card">
          <h3>Pending</h3>
          <p>{analytics.pending}</p>
        </div>

        <div className="analytics-card">
          <h3>Completion Rate</h3>
          <p>{analytics.completionRate}%</p>
        </div>
      </div>

      <div className="insight-panels">
        <div className="insight-card">
          <h3>Productivity Score</h3>
          <div className="progress-track">
            <div
              className="progress-fill cyan-fill"
              style={{ width: `${analytics.productivityScore}%` }}
            ></div>
          </div>
          <span>{analytics.productivityScore}%</span>
        </div>

        <div className="insight-card">
          <h3>Focus Score</h3>
          <div className="progress-track">
            <div
              className="progress-fill purple-fill"
              style={{ width: `${analytics.focusScore}%` }}
            ></div>
          </div>
          <span>{analytics.focusScore}%</span>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Insights</h3>
          <p>
            You have completed <strong>{analytics.completed}</strong> out of{" "}
            <strong>{analytics.total}</strong> tasks. Keep reducing pending work
            to improve your performance streak.
          </p>
        </div>

        <div className="summary-card">
          <h3>Recommendation</h3>
          <p>
            Focus on finishing high-priority pending tasks first. A higher
            completion rate will improve both your productivity and focus score.
          </p>
        </div>
      </div>
    </div>
  );
}