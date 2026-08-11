import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";

import { supabase } from "../../lib/supabase";
import { loginUser } from "../../services/authService";

import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      // Login
      const result = await loginUser(email.trim(), password);

      console.log("LOGIN RESULT:", result);

      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      // Temporary: use this token for Swagger testing
      console.log("ACCESS TOKEN:", session?.access_token);

      if (!session) {
        throw new Error("Login successful, but no session was created.");
      }

      // Go to dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message || "Unable to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Sparkles size={24} />
        </div>

        <h1>Welcome to NexaRAG</h1>

        <p className="auth-subtitle">
          Sign in to access your company knowledge base.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <div className="auth-input">
            <Mail size={18} />

            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="auth-input">
            <Lock size={18} />

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || !email.trim() || !password.trim()}
          >
            <LogIn size={18} />

            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create employee account</Link>
        </p>
      </div>
    </div>
  );
}
