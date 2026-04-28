'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../services/api";

function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Register to continue</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={onChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={onChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={onChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;