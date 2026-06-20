import React from "react";

export default function CircularScore({ value = 0, label = "Score" }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <svg width="110" height="110" viewBox="0 0 110 110" className="shrink-0">
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="10"
        />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-900 dark:text-slate-100"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
        />
        <text
          x="55"
          y="58"
          textAnchor="middle"
          className="fill-slate-900 dark:fill-slate-100"
          fontSize="20"
          fontWeight="700"
        >
          {Math.round(v)}
        </text>
        <text
          x="55"
          y="76"
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400"
          fontSize="10"
        >
          / 100
        </text>
      </svg>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-lg font-semibold">{v >= 80 ? "Strong" : v >= 60 ? "Moderate" : "Needs work"}</div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Improve keywords, formatting, and role alignment.
        </div>
      </div>
    </div>
  );
}

