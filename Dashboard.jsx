import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import StatCard from "../components/StatCard.jsx";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, i] = await Promise.all([api.get("/reports/dashboard"), api.get("/interviews")]);
        setStats(s.data);
        setInterviews(i.data.interviews || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load dashboard");
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Track your mock interviews and performance improvements.
          </p>
        </div>
        <Link
          to="/start"
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium"
        >
          Start interview
        </Link>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Interviews (recent)" value={stats?.totals?.interviews ?? "—"} />
        <StatCard label="Reports (recent)" value={stats?.totals?.reports ?? "—"} />
        <StatCard label="Tip" value="Practice daily" hint="Consistency improves confidence." />
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Progress</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Overall score trend (latest reports)
            </div>
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.scoreTimeline || []}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="clarity" stroke="#0f172a" strokeWidth={2} />
              <Line type="monotone" dataKey="confidence" stroke="#475569" strokeWidth={2} />
              <Line type="monotone" dataKey="grammar" stroke="#94a3b8" strokeWidth={2} />
              <Line type="monotone" dataKey="relevance" stroke="#64748b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Recent interviews</div>
          <Link className="text-sm underline" to="/history">
            View all
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">Domain</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.slice(0, 8).map((it) => (
                <tr key={it._id} className="border-t">
                  <td className="py-2">{it.domain}</td>
                  <td className="py-2">{it.status}</td>
                  <td className="py-2">
                    {new Date(it.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </td>
                  <td className="py-2">
                    <Link className="underline" to={`/interview/${it._id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {interviews.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={4}>
                    No interviews yet. Start one to see data here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
