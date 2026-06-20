import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/interviews");
        setItems(data.interviews || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load history");
      }
    })();
  }, []);

  const filtered = items.filter((it) => {
    if (domain !== "ALL" && it.domain !== domain) return false;
    if (status !== "ALL" && it.status !== status) return false;
    if (q.trim()) {
      const s = `${it.domain} ${it.status}`.toLowerCase();
      if (!s.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">All your interviews.</p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
          {error}
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search (domain/status)"
              className="border dark:border-slate-800 rounded-lg px-3 py-2 text-sm w-full md:w-64"
            />
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ALL">All domains</option>
              <option value="HR">HR</option>
              <option value="DSA">DSA</option>
              <option value="TECHNICAL">TECHNICAL</option>
              <option value="SYSTEM_DESIGN">SYSTEM_DESIGN</option>
              <option value="BEHAVIORAL">BEHAVIORAL</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ALL">All status</option>
              <option value="active">active</option>
              <option value="completed">completed</option>
            </select>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Showing <span className="font-medium">{filtered.length}</span> of{" "}
            <span className="font-medium">{items.length}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <div
              key={it._id}
              className="rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Domain</div>
                  <div className="font-semibold">{it.domain}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    it.status === "completed"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200"
                      : "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200"
                  }`}
                >
                  {it.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Questions</div>
                  <div className="font-medium">{it.maxQuestions}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Created</div>
                  <div className="font-medium">
                    {new Date(it.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  className="inline-flex text-sm font-medium underline"
                  to={`/interview/${it._id}`}
                >
                  Open interview →
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              No interviews match your filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
