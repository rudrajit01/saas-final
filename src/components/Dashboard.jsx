'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { name: "Overview", path: "/dashboard" },
    { name: "Tasks", path: "/tasks" },
    { name: "Projects", path: "/projects" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div>
          <h2 className="dashboard-logo">Productivity Suite</h2>

          <nav className="dashboard-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={isActive ? "active-nav-link" : ""}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-welcome">Welcome back</p>
            <h1>{user?.name || "User"} Dashboard</h1>
          </div>

          <div className="dashboard-profile">
            <span>{user?.email || "user@email.com"}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>128</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>96</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>32</p>
          </div>

          <div className="stat-card">
            <h3>Productivity</h3>
            <p>87%</p>
          </div>
        </div>

        <div className="dashboard-panels">
          <div className="panel-card">
            <h3>Today’s Focus</h3>
            <p>
              Complete your high-priority tasks, review active projects, and
              maintain your productivity streak.
            </p>
          </div>

          <div className="panel-card">
            <h3>Recent Activity</h3>
            <ul>
              <li>Completed UI redesign task</li>
              <li>Updated authentication module</li>
              <li>Created new project workspace</li>
              <li>Reviewed weekly analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}