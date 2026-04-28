"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const navLinks = [
    { name: "Overview", path: "/dashboard" },
    { name: "Tasks", path: "/dashboard/tasks" },
    { name: "Projects", path: "/dashboard/projects" },
    { name: "Analytics", path: "/dashboard/analytics" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
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

        <div className="dashboard-user-box">
          <p>{user?.name || "User"}</p>
          <span>{user?.email || "user@email.com"}</span>
        </div>

        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Switch to Light" : "Switch to Dark"}
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}