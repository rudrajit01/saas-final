"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Login failed");
        setLoading(false);
        return;
      }

      setMessage("Login successful");

      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 700);
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
          Secure <span>Login</span>
        </h1>

        <p className="cyber-subtitle">
          Sign in to continue to your productivity workspace.
        </p>

        <form className="cyber-form" onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="cyber-login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>

          <p className="auth-switch">
            <Link href="/forgot-password">Forgot password?</Link>
          </p>

          {message && (
            <p
              className={`cyber-message ${
                message === "Login successful" ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <p className="auth-switch">
            Don’t have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}