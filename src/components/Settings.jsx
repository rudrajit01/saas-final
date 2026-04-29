"use client";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedUser = localStorage.getItem("user");
    const savedPreferences = localStorage.getItem("preferences");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Preferences & Account</p>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <button
          className="rounded-xl border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-slate-800"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-5 text-xl font-semibold text-white">Profile Information</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleUserChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-5 text-xl font-semibold text-white">App Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-4">
              <span className="text-slate-200">Dark Mode</span>
              <button
                onClick={() => handleToggle("darkMode")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  preferences.darkMode
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {preferences.darkMode ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-4">
              <span className="text-slate-200">Email Notifications</span>
              <button
                onClick={() => handleToggle("emailNotifications")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  preferences.emailNotifications
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {preferences.emailNotifications ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-4">
              <span className="text-slate-200">Task Reminders</span>
              <button
                onClick={() => handleToggle("taskReminders")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  preferences.taskReminders
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {preferences.taskReminders ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <button
          className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          onClick={handleSave}
        >
          Save Changes
        </button>

        {success ? (
          <p className="text-sm font-medium text-green-400">{success}</p>
        ) : null}
      </div>
    </div>
  );
}