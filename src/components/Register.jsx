"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("Registration successful");

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-login-page">
      <div className="cyber-grid"></div>
      <div className="cyber-glow cyber-glow-1"></div>
      <div className="cyber-glow cyber-glow-2"></div>

      <div className="cyber-login-card">
        <div className="cyber-badge">MY PRODUCTIVITY</div>

        <h1 className="cyber-title">
          Create <span>Account</span>
        </h1>

        <p className="cyber-subtitle">
          Register to unlock your personal productivity dashboard.
        </p>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <div className="cyber-input-group">
            <label>Name</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">U</span>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="cyber-input-group">
            <label>Email</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">@</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="cyber-input-group">
            <label>Password</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">#</span>
              <input
                type="password"
                name="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="cyber-login-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          {message && (
            <p
              className={`cyber-message ${
                message === "Registration successful" ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <p className="auth-switch">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}