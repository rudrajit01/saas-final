"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-logo">My Productivity</h2>

        <div className="dashboard-user-box">
          <p>{user?.name || "User"}</p>
          <span>{user?.email || "user@email.com"}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-welcome">Welcome back</p>
            <h1>Overview</h1>
          </div>
        </div>
      </main>
    </div>
  );
}