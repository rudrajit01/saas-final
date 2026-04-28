'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    emailNotifications: true,
    taskReminders: true,
  });

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedPreferences = localStorage.getItem("preferences");

    if (!token) {
      router.push("/login");
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [router]);

  const handleUserChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("preferences", JSON.stringify(preferences));
    setSuccess("Settings saved successfully!");

    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <p className="settings-label">Preferences & Account</p>
          <h1>Settings</h1>
        </div>

        <button className="back-btn" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile Information</h3>

          <div className="settings-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="settings-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="settings-card">
          <h3>App Preferences</h3>

          <div className="toggle-row">
            <span>Dark Mode</span>
            <button onClick={() => handleToggle("darkMode")}>
              {preferences.darkMode ? "On" : "Off"}
            </button>
          </div>

          <div className="toggle-row">
            <span>Email Notifications</span>
            <button onClick={() => handleToggle("emailNotifications")}>
              {preferences.emailNotifications ? "On" : "Off"}
            </button>
          </div>

          <div className="toggle-row">
            <span>Task Reminders</span>
            <button onClick={() => handleToggle("taskReminders")}>
              {preferences.taskReminders ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

        {success ? <p className="success-text">{success}</p> : null}
      </div>
    </div>
  );
}