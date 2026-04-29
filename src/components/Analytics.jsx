"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Analytics() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch("/api/tasks", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        let data = null;

        try {
          data = await res.json();
        } catch (jsonError) {
          throw new Error("Invalid JSON response from /api/tasks");
        }

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch analytics data");
        }

        const taskList = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : [];
        setTasks(taskList);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        setTasks([]);
        setErrorMessage(error?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const analytics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const productivityScore = Math.min(
      100,
      completionRate + (total >= 5 ? 10 : 0)
    );
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Performance Insights</p>
          <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
        </div>

        <button
          className="rounded-xl border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-slate-800"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 text-slate-400 shadow-lg backdrop-blur-xl">
          Loading analytics...
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-slate-900/70 p-6 text-red-300 shadow-lg backdrop-blur-xl">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
              <h3 className="text-sm text-slate-400">Total Tasks</h3>
              <p className="mt-2 text-3xl font-bold text-white">{analytics.total}</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
              <h3 className="text-sm text-slate-400">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-white">{analytics.completed}</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
              <h3 className="text-sm text-slate-400">Pending</h3>
              <p className="mt-2 text-3xl font-bold text-white">{analytics.pending}</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
              <h3 className="text-sm text-slate-400">Completion Rate</h3>
              <p className="mt-2 text-3xl font-bold text-white">{analytics.completionRate}%</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Productivity Score</h3>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${analytics.productivityScore}%` }}
                />
              </div>
              <span className="mt-3 inline-block text-sm font-medium text-cyan-300">
                {analytics.productivityScore}%
              </span>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Focus Score</h3>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${analytics.focusScore}%` }}
                />
              </div>
              <span className="mt-3 inline-block text-sm font-medium text-purple-300">
                {analytics.focusScore}%
              </span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Insights</h3>
              <p className="mt-3 text-slate-300">
                You have completed <strong>{analytics.completed}</strong> out of{" "}
                <strong>{analytics.total}</strong> tasks. Keep reducing pending work
                to improve your performance streak.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Recommendation</h3>
              <p className="mt-3 text-slate-300">
                Focus on finishing high-priority pending tasks first. A higher
                completion rate will improve both your productivity and focus score.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}