"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import WeatherWidget from "@/components/WeatherWidget";
import DeadlineCalendar from "@/components/DeadlineCalendar";
import RecentNews from "@/components/RecentNews";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch("/api/logout", {
        method: "POST",
      });

      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { name: "Overview", path: "/dashboard" },
    { name: "Tasks", path: "/dashboard/tasks" },
    { name: "Projects", path: "/dashboard/projects" },
    { name: "Analytics", path: "/dashboard/analytics" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_35%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)] text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-cyan-500/10 bg-slate-950/60 p-5 backdrop-blur-xl">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                  Workspace
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Productivity Suite
                </h2>
              </div>

              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Signed in as
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {user?.name || "User"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {user?.email || "user@email.com"}
                </p>
              </div>

              <button
                className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </aside>

        <main className="p-4 md:p-6 xl:p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-cyan-500/10 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-300">Welcome back</p>
                <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                  {user?.name || "User"} Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
                  See your workspace overview with weather updates, deadline
                  calendar, and recent news at a glance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    Active Session
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Focus
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cyan-300">
                    Smart Overview
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
                <p className="text-sm text-slate-400">Total Tasks</p>
                <h2 className="mt-2 text-3xl font-bold text-white">128</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Track all assigned and personal tasks.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
                <p className="text-sm text-slate-400">Completed</p>
                <h2 className="mt-2 text-3xl font-bold text-white">96</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Strong progress across active work items.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
                <p className="text-sm text-slate-400">Pending</p>
                <h2 className="mt-2 text-3xl font-bold text-white">32</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Prioritize upcoming deadlines efficiently.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg backdrop-blur-xl">
                <p className="text-sm text-slate-400">Productivity</p>
                <h2 className="mt-2 text-3xl font-bold text-white">87%</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Maintain your streak with focused execution.
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <WeatherWidget />
              </div>

              <div className="xl:col-span-2">
                <DeadlineCalendar />
              </div>
            </div>

            <RecentNews />
          </div>
        </main>
      </div>
    </div>
  );
}