import React from "react";

export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div>
      ) : null}
    </div>
  );
}
