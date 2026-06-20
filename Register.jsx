import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.errors?.[0]?.message ||
        data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Create account</h1>
        {error ? (
          <div className="mt-4 text-sm bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-3">
            {error}
          </div>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
              placeholder="Min 6 characters"
            />
          </div>
          <button
            disabled={busy}
            className="w-full bg-slate-900 text-white rounded-lg py-2 font-medium disabled:opacity-60"
          >
            {busy ? "Creating..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link className="text-slate-900 underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
