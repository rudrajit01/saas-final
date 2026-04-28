"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Reset failed");
        setLoading(false);
        return;
      }

      setMessage("Password reset successful");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
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
        <div className="cyber-badge">NEW CREDENTIAL</div>

        <h1 className="cyber-title">
          Reset <span>Password</span>
        </h1>

        <p className="cyber-subtitle">
          Enter your new password and confirm it.
        </p>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <div className="cyber-input-group">
            <label>New Password</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">#</span>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="cyber-input-group">
            <label>Confirm Password</label>
            <div className="cyber-input-wrap">
              <span className="cyber-icon">#</span>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="cyber-login-btn" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {message && (
            <p
              className={`cyber-message ${
                message === "Password reset successful" ? "success" : "error"
              }`}
            >
              {message}
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