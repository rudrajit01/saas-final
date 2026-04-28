"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetLink("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Request failed");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Reset link generated");
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
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
        <div className="cyber-badge">RESET ACCESS</div>

        <h1 className="cyber-title">
          Forgot <span>Password</span>
        </h1>

        <p className="cyber-subtitle">
          Enter your email to generate a password reset link.
        </p>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <div className="cyber-input-group">
            <label>Email</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">@</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="cyber-login-btn" disabled={loading}>
            {loading ? "Generating..." : "Send Reset Link"}
          </button>

          {message && (
            <p className={`cyber-message ${resetLink ? "success" : "error"}`}>
              {message}
            </p>
          )}

          {resetLink && (
            <p className="auth-switch">
              <a href={resetLink}>Open reset page</a>
            </p>
          )}

          <p className="auth-switch">
            Back to <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}