'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="sidebar">
      <h2>SaaS App</h2>

      <Link
        href="/dashboard"
        className={pathname === "/dashboard" ? "active" : ""}
      >
        Dashboard
      </Link>

      <Link
        href="/notes"
        className={pathname === "/notes" ? "active" : ""}
      >
        Notes
      </Link>

      <Link
        href="/tasks"
        className={pathname === "/tasks" ? "active" : ""}
      >
        Tasks
      </Link>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
