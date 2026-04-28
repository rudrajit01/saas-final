'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="header">
      <div>
        <h2>Welcome Back🔥</h2>
        <p>{user?.name || "User"}</p>
      </div>

      <div className="header-actions">
        <ThemeToggle />

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;