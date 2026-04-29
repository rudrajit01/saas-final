"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Projects() {
  const router = useRouter();

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Dashboard Redesign",
      description: "Improve the dashboard UI and overall user experience.",
      progress: 72,
      status: "In Progress",
      priority: "High",
      dueDate: "2026-05-05",
    },
    {
      id: 2,
      name: "Task API Setup",
      description: "Build and connect task APIs with the frontend.",
      progress: 90,
      status: "Almost Done",
      priority: "Medium",
      dueDate: "2026-05-01",
    },
    {
      id: 3,
      name: "Analytics Module",
      description: "Create charts and insights for productivity tracking.",
      progress: 45,
      status: "Ongoing",
      priority: "High",
      dueDate: "2026-05-10",
    },
    {
      id: 4,
      name: "Settings Page",
      description: "Add user profile and preference management.",
      progress: 60,
      status: "In Review",
      priority: "Low",
      dueDate: "2026-05-07",
    },
  ]);

  const summary = useMemo(() => {
    const total = projects.length;
    const completedLike = projects.filter((project) => project.progress >= 80).length;
    const active = projects.filter((project) => project.progress < 100).length;
    const avgProgress = total
      ? Math.round(
          projects.reduce((sum, project) => sum + project.progress, 0) / total
        )
      : 0;

    return {
      total,
      completedLike,
      active,
      avgProgress,
    };
  }, [projects]);

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-red-500/15 text-red-300 border border-red-500/20";
    }

    if (priority === "Medium") {
      return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
    }

    return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  };

  const getStatusClass = (status) => {
    if (status === "Almost Done") {
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20";
    }

    if (status === "In Review") {
      return "bg-purple-500/15 text-purple-300 border border-purple-500/20";
    }

    return "bg-slate-800 text-slate-300 border border-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Track your work</p>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
        </div>

        <button
          className="rounded-xl border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-slate-800"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
          <p className="text-sm text-slate-400">Total Projects</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{summary.total}</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
          <p className="text-sm text-slate-400">Active</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{summary.active}</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
          <p className="text-sm text-slate-400">Almost Done</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {summary.completedLike}
          </h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
          <p className="text-sm text-slate-400">Average Progress</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {summary.avgProgress}%
          </h2>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                      project.priority
                    )}`}
                  >
                    {project.priority}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-medium text-cyan-300">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                <p>Due Date: <span className="text-slate-200">{project.dueDate}</span></p>

                <button className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}